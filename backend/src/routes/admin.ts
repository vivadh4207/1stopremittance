import { Router, Request, Response, NextFunction } from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { sendSuccess } from '../utils/apiResponse';
import { prisma } from '../config/database';
import { parsePagination, buildPaginationMeta } from '../utils/pagination';
import { Decimal } from '@prisma/client/runtime/library';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticateToken, requireAdmin);

router.get(
  '/users',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const pagination = parsePagination(req.query);

      const search = req.query['search'] as string | undefined;
      const whereClause = search
        ? {
            OR: [
              { email: { contains: search, mode: 'insensitive' as const } },
              { firstName: { contains: search, mode: 'insensitive' as const } },
              { lastName: { contains: search, mode: 'insensitive' as const } },
            ],
          }
        : {};

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where: whereClause,
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            country: true,
            role: true,
            isActive: true,
            kycStatus: true,
            emailVerified: true,
            createdAt: true,
            updatedAt: true,
            _count: { select: { transfers: true } },
          },
          orderBy: { createdAt: 'desc' },
          skip: pagination.skip,
          take: pagination.take,
        }),
        prisma.user.count({ where: whereClause }),
      ]);

      sendSuccess(
        res,
        users,
        'Users retrieved',
        200,
        buildPaginationMeta(total, pagination.page, pagination.limit),
      );
    } catch (err) {
      next(err);
    }
  },
);

router.get(
  '/transactions',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const pagination = parsePagination(req.query);

      const [transactions, total] = await Promise.all([
        prisma.transaction.findMany({
          include: {
            wallet: {
              select: { userId: true, currency: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip: pagination.skip,
          take: pagination.take,
        }),
        prisma.transaction.count(),
      ]);

      sendSuccess(
        res,
        transactions,
        'Transactions retrieved',
        200,
        buildPaginationMeta(total, pagination.page, pagination.limit),
      );
    } catch (err) {
      next(err);
    }
  },
);

router.get(
  '/stats',
  async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const [
        totalUsers,
        activeUsers,
        pendingKYC,
        totalTransfers,
        completedTransfers,
        failedTransfers,
        volumeResult,
        revenueResult,
        recentTransfers,
      ] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { isActive: true } }),
        prisma.user.count({ where: { kycStatus: 'SUBMITTED' } }),
        prisma.transfer.count(),
        prisma.transfer.count({ where: { status: 'COMPLETED' } }),
        prisma.transfer.count({ where: { status: 'FAILED' } }),
        prisma.transfer.aggregate({
          where: { status: 'COMPLETED' },
          _sum: { sendAmount: true },
        }),
        prisma.transfer.aggregate({
          where: { status: 'COMPLETED' },
          _sum: { fee: true },
        }),
        prisma.transfer.findMany({
          where: { status: 'COMPLETED' },
          orderBy: { completedAt: 'desc' },
          take: 5,
          select: {
            id: true,
            sendAmount: true,
            sendCurrency: true,
            receiveAmount: true,
            receiveCurrency: true,
            recipientFirstName: true,
            recipientLastName: true,
            completedAt: true,
          },
        }),
      ]);

      const totalVolume = volumeResult._sum.sendAmount ?? new Decimal(0);
      const totalRevenue = revenueResult._sum.fee ?? new Decimal(0);

      sendSuccess(
        res,
        {
          users: { total: totalUsers, active: activeUsers, pendingKYC },
          transfers: {
            total: totalTransfers,
            completed: completedTransfers,
            failed: failedTransfers,
            pending: totalTransfers - completedTransfers - failedTransfers,
          },
          financials: {
            totalVolume: Number(totalVolume),
            totalRevenue: Number(totalRevenue),
          },
          recentTransfers,
        },
        'Stats retrieved',
      );
    } catch (err) {
      next(err);
    }
  },
);

router.patch(
  '/users/:id/status',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { isActive } = req.body as { isActive: boolean };
      const user = await prisma.user.update({
        where: { id: req.params['id'] },
        data: { isActive },
        select: { id: true, email: true, isActive: true },
      });
      sendSuccess(res, user, `User ${isActive ? 'activated' : 'deactivated'}`);
    } catch (err) {
      next(err);
    }
  },
);

export default router;
