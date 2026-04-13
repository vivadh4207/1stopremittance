import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database';
import { authenticateToken } from '../middleware/auth';
import { sendSuccess } from '../utils/apiResponse';
import { AppError } from '../middleware/errorHandler';
import * as kycService from '../services/kycService';

const router = Router();

const updateProfileSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  phone: z.string().min(7).max(20).optional(),
  dateOfBirth: z.string().datetime({ offset: true }).optional().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()),
});

router.get(
  '/me',
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user!.userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          dateOfBirth: true,
          country: true,
          role: true,
          isActive: true,
          kycStatus: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) throw new AppError('User not found', 404);

      sendSuccess(res, user, 'Profile retrieved');
    } catch (err) {
      next(err);
    }
  },
);

router.put(
  '/me',
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = updateProfileSchema.parse(req.body);

      const updateData: {
        firstName?: string;
        lastName?: string;
        phone?: string;
        dateOfBirth?: Date;
      } = {};

      if (data.firstName !== undefined) updateData.firstName = data.firstName;
      if (data.lastName !== undefined) updateData.lastName = data.lastName;
      if (data.phone !== undefined) updateData.phone = data.phone;
      if (data.dateOfBirth !== undefined) updateData.dateOfBirth = new Date(data.dateOfBirth);

      if (Object.keys(updateData).length === 0) {
        sendSuccess(res, null, 'No changes made');
        return;
      }

      const user = await prisma.user.update({
        where: { id: req.user!.userId },
        data: updateData,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          dateOfBirth: true,
          country: true,
          role: true,
          kycStatus: true,
          emailVerified: true,
          updatedAt: true,
        },
      });

      sendSuccess(res, user, 'Profile updated');
    } catch (err) {
      next(err);
    }
  },
);

router.get(
  '/me/kyc',
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

export default router;
