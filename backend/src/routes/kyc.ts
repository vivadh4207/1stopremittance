import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authenticateToken } from '../middleware/auth';
import { sendSuccess } from '../utils/apiResponse';
import * as kycService from '../services/kycService';
import * as notificationService from '../services/notificationService';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { DocType } from '@prisma/client';

const router = Router();

const submitKYCSchema = z.object({
  docType: z.nativeEnum(DocType),
  docNumber: z.string().min(1, 'Document number is required').max(100),
  frontImageUrl: z.string().url('Front image URL must be a valid URL'),
  backImageUrl: z.string().url('Back image URL must be a valid URL').optional(),
  selfieUrl: z.string().url('Selfie URL must be a valid URL').optional(),
});

router.post(
  '/submit',
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = submitKYCSchema.parse(req.body);
      const result = await kycService.submitKYC(req.user!.userId, data);

      const user = await prisma.user.findUnique({
        where: { id: req.user!.userId },
        select: { id: true, email: true, firstName: true, lastName: true },
      });
      if (user) {
        await notificationService.sendKYCStatusUpdate(user, 'SUBMITTED');
      }

      sendSuccess(res, result, 'KYC documents submitted successfully', 201);
    } catch (err) {
      next(err);
    }
  },
);

router.get(
  '/status',
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const status = await kycService.getKYCStatus(req.user!.userId);
      sendSuccess(res, status, 'KYC status retrieved');
    } catch (err) {
      next(err);
    }
  },
);

// Admin-only route to review KYC
router.put(
  '/:docId/review',
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (req.user!.role !== 'ADMIN') {
        throw new AppError('Admin access required', 403);
      }

      const reviewSchema = z.object({
        status: z.enum(['APPROVED', 'REJECTED']),
        reviewNotes: z.string().max(500).optional(),
      });

      const { status, reviewNotes } = reviewSchema.parse(req.body);
      const doc = await kycService.reviewKYC(req.params['docId']!, status, reviewNotes);

      const kycDoc = await prisma.kYCDocument.findUnique({
        where: { id: doc.id },
        include: { user: { select: { id: true, email: true, firstName: true, lastName: true } } },
      });

      if (kycDoc?.user) {
        await notificationService.sendKYCStatusUpdate(kycDoc.user, status);
      }

      sendSuccess(res, doc, `KYC document ${status.toLowerCase()}`);
    } catch (err) {
      next(err);
    }
  },
);

export default router;
