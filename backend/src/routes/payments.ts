import { Router, Request, Response, NextFunction } from 'express';
import express from 'express';
import { z } from 'zod';
import { authenticateToken } from '../middleware/auth';
import { sendSuccess, sendError } from '../utils/apiResponse';
import * as stripeService from '../services/stripeService';
import { logger } from '../utils/logger';

const router = Router();

const intentSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().length(3, 'Currency must be a 3-letter code').toUpperCase().default('USD'),
  transferId: z.string().uuid().optional(),
  description: z.string().max(200).optional(),
});

router.post(
  '/stripe/intent',
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { amount, currency, transferId, description } = intentSchema.parse(req.body);

      const paymentIntent = await stripeService.createPaymentIntent(amount, currency, {
        userId: req.user!.userId,
        transferId,
        description,
      });

      sendSuccess(
        res,
        {
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
        },
        'Payment intent created',
        201,
      );
    } catch (err) {
      next(err);
    }
  },
);

router.post(
  '/stripe/webhook',
  express.raw({ type: 'application/json' }),
  async (req: Request, res: Response): Promise<void> => {
    const signature = req.headers['stripe-signature'] as string;

    if (!signature) {
      sendError(res, 'Missing stripe-signature header', 400);
      return;
    }

    let event;
    try {
      event = stripeService.constructWebhookEvent(req.body as Buffer, signature);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Webhook signature verification failed';
      logger.error('Stripe webhook verification failed', { message });
      sendError(res, message, 400);
      return;
    }

    logger.info('Stripe webhook received', { type: event.type, id: event.id });

    try {
      switch (event.type) {
        case 'payment_intent.succeeded': {
          const paymentIntent = event.data.object;
          await stripeService.handlePaymentSuccess(paymentIntent.id);
          break;
        }
        case 'payment_intent.payment_failed': {
          const paymentIntent = event.data.object;
          await stripeService.handlePaymentFailure(paymentIntent.id);
          break;
        }
        case 'payment_intent.canceled': {
          const paymentIntent = event.data.object;
          await stripeService.handlePaymentFailure(paymentIntent.id);
          break;
        }
        default:
          logger.debug('Unhandled Stripe webhook event type', { type: event.type });
      }

      res.json({ received: true });
    } catch (err) {
      logger.error('Error processing Stripe webhook', { err, eventType: event.type });
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  },
);

export default router;
