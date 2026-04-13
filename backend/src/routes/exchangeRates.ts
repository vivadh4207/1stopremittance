import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { sendSuccess, sendError } from '../utils/apiResponse';
import * as exchangeRateService from '../services/exchangeRateService';

const router = Router();

const rateQuerySchema = z.object({
  from: z.string().min(3).max(3).toUpperCase(),
  to: z.string().min(3).max(3).toUpperCase(),
});

router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = rateQuerySchema.safeParse(req.query);
      if (!result.success) {
        sendError(res, 'Invalid query parameters: from and to currency codes are required (3-letter ISO codes)', 400);
        return;
      }

      const { from, to } = result.data;

      if (from === to) {
        sendSuccess(
          res,
          { fromCurrency: from, toCurrency: to, midMarketRate: 1, customerRate: 1, spread: 0, source: 'identity' },
          'Exchange rate retrieved',
        );
        return;
      }

      const rate = await exchangeRateService.getRate(from, to);
      sendSuccess(res, rate, 'Exchange rate retrieved');
    } catch (err) {
      next(err);
    }
  },
);

export default router;
