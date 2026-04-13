import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authenticateToken } from '../middleware/auth';
import { sendSuccess } from '../utils/apiResponse';
import * as transferService from '../services/transferService';
import * as stripeService from '../services/stripeService';
import * as notificationService from '../services/notificationService';
import { parsePagination } from '../utils/pagination';
import { prisma } from '../config/database';

const router = Router();

const quoteSchema = z.object({
  sendAmount: z.number().positive('Send amount must be positive'),
  sendCurrency: z.string().length(3, 'Currency must be a 3-letter code').toUpperCase(),
  receiveCurrency: z.string().length(3, 'Currency must be a 3-letter code').toUpperCase(),
  recipientCountry: z.string().length(2, 'Country must be a 2-letter ISO code').toUpperCase(),
});

const sendTransferSchema = z.object({
  sendAmount: z.number().positive('Send amount must be positive'),
  sendCurrency: z.string().length(3).toUpperCase(),
  receiveCurrency: z.string().length(3).toUpperCase(),
  recipientFirstName: z.string().min(1, 'Recipient first name is required').max(50),
  recipientLastName: z.string().min(1, 'Recipient last name is required').max(50),
  recipientEmail: z.string().email().optional(),
  recipientPhone: z.string().min(7).max(20).optional(),
  recipientCountry: z.string().length(2).toUpperCase(),
  recipientBankName: z.string().max(100).optional(),
  recipientAccountNumber: z.string().max(50).optional(),
  recipientRoutingNumber: z.string().max(50).optional(),
  purposeCode: z.string().max(50).optional(),
  notes: z.string().max(500).optional(),
});

router.post(
  '/quote',
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = quoteSchema.parse(req.body);
      const result = await transferService.quote(req.user!.userId, data);
      sendSuccess(res, result, 'Quote generated');
    } catch (err) {
      next(err);
    }
  },
);

router.post(
  '/send',
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = sendTransferSchema.parse(req.body);

      // Create the transfer record
      const transfer = await transferService.createTransfer(req.user!.userId, data);

      // Create Stripe payment intent for the total amount
      let paymentIntent = null;
      try {
        paymentIntent = await stripeService.createPaymentIntent(
          Number(transfer.totalDeducted),
          transfer.sendCurrency,
          {
            transferId: transfer.id,
            userId: req.user!.userId,
            description: `Transfer to ${transfer.recipientFirstName} ${transfer.recipientLastName}`,
          },
        );

        // Update transfer with payment intent ID
        await prisma.transfer.update({
          where: { id: transfer.id },
          data: { stripePaymentIntentId: paymentIntent.id },
        });
      } catch (stripeErr) {
        // Stripe not configured - for development/testing, process transfer directly
        const errMessage = stripeErr instanceof Error ? stripeErr.message : '';
        if (errMessage.includes('not configured')) {
          await transferService.processTransfer(transfer.id);
          await transferService.completeTransfer(transfer.id);
        } else {
          throw stripeErr;
        }
      }

      // Notify sender
      const user = await prisma.user.findUnique({
        where: { id: req.user!.userId },
        select: { id: true, email: true, firstName: true, lastName: true },
      });
      if (user) {
        await notificationService.sendTransferConfirmation(user, transfer);
      }

      const updatedTransfer = await prisma.transfer.findUnique({ where: { id: transfer.id } });

      sendSuccess(
        res,
        {
          transfer: updatedTransfer,
          paymentIntent: paymentIntent
            ? { clientSecret: paymentIntent.client_secret, id: paymentIntent.id }
            : null,
        },
        'Transfer initiated',
        201,
      );
    } catch (err) {
      next(err);
    }
  },
);

router.get(
  '/',
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const pagination = parsePagination(req.query);
      const result = await transferService.getTransfers(req.user!.userId, pagination);
      sendSuccess(res, result.transfers, 'Transfers retrieved', 200, result.meta);
    } catch (err) {
      next(err);
    }
  },
);

router.get(
  '/:id',
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const transfer = await transferService.getTransfer(req.params['id']!, req.user!.userId);
      sendSuccess(res, transfer, 'Transfer retrieved');
    } catch (err) {
      next(err);
    }
  },
);

export default router;
