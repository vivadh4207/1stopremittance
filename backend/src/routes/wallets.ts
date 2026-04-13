import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authenticateToken } from '../middleware/auth';
import { sendSuccess, sendError } from '../utils/apiResponse';
import * as walletService from '../services/walletService';
import { parsePagination } from '../utils/pagination';
import { AppError } from '../middleware/errorHandler';

const router = Router();

const fundSchema = z.object({
  amount: z
    .number({ required_error: 'Amount is required' })
    .positive('Amount must be positive')
    .max(10000, 'Maximum single fund amount is $10,000'),
});

router.get(
  '/',
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const wallet = await walletService.getWallet(req.user!.userId);
      sendSuccess(res, wallet, 'Wallet retrieved');
    } catch (err) {
      next(err);
    }
  },
);

router.post(
  '/fund',
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { amount } = fundSchema.parse(req.body);
      const result = await walletService.fundWallet(req.user!.userId, amount);
      sendSuccess(res, result, 'Wallet funded successfully');
    } catch (err) {
      next(err);
    }
  },
);

router.get(
  '/:id/transactions',
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const walletId = req.params['id'];
      if (!walletId) {
        sendError(res, 'Wallet ID is required', 400);
        return;
      }

      // Verify the wallet belongs to the requesting user
      const wallet = await walletService.getWallet(req.user!.userId);
      if (wallet.id !== walletId) {
        throw new AppError('Wallet not found or access denied', 404);
      }

      const pagination = parsePagination(req.query);
      const result = await walletService.getTransactions(walletId, pagination);
      sendSuccess(res, result.transactions, 'Transactions retrieved', 200, result.meta);
    } catch (err) {
      next(err);
    }
  },
);

export default router;
