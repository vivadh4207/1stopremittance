import { Decimal } from '@prisma/client/runtime/library';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { PaginationParams, buildPaginationMeta } from '../utils/pagination';
import { TransactionType } from '@prisma/client';

export async function getWallet(userId: string) {
  let wallet = await prisma.wallet.findUnique({ where: { userId } });

  if (!wallet) {
    wallet = await prisma.wallet.create({
      data: { userId, currency: 'USD', balance: 0 },
    });
  }

  return wallet;
}

export async function getTransactions(walletId: string, pagination: PaginationParams) {
  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where: { walletId },
      orderBy: { createdAt: 'desc' },
      skip: pagination.skip,
      take: pagination.take,
    }),
    prisma.transaction.count({ where: { walletId } }),
  ]);

  return {
    transactions,
    meta: buildPaginationMeta(total, pagination.page, pagination.limit),
  };
}

async function applyWalletDelta(
  wallet: Awaited<ReturnType<typeof getWallet>>,
  delta: number,
  type: TransactionType,
  description: string,
  referenceId?: string,
) {
  const balanceBefore = Number(wallet.balance);
  const balanceAfter = balanceBefore + delta;

  const [updatedWallet, transaction] = await prisma.$transaction([
    prisma.wallet.update({
      where: { id: wallet.id },
      data: { balance: new Decimal(balanceAfter) },
    }),
    prisma.transaction.create({
      data: {
        walletId: wallet.id,
        type,
        amount: new Decimal(Math.abs(delta)),
        currency: wallet.currency,
        balanceBefore: new Decimal(balanceBefore),
        balanceAfter: new Decimal(balanceAfter),
        description,
        referenceId,
      },
    }),
  ]);

  return { wallet: updatedWallet, transaction };
}

export async function fundWallet(userId: string, amount: number) {
  if (amount <= 0) {
    throw new AppError('Amount must be greater than zero', 400);
  }

  const wallet = await getWallet(userId);
  return applyWalletDelta(wallet, amount, TransactionType.CREDIT, 'Wallet funding');
}

export async function debitWallet(
  userId: string,
  amount: number,
  description: string,
  referenceId?: string,
  type: TransactionType = TransactionType.DEBIT,
) {
  if (amount <= 0) {
    throw new AppError('Amount must be greater than zero', 400);
  }

  const wallet = await getWallet(userId);

  if (Number(wallet.balance) < amount) {
    throw new AppError('Insufficient wallet balance', 400);
  }

  return applyWalletDelta(wallet, -amount, type, description, referenceId);
}

export async function creditWallet(
  userId: string,
  amount: number,
  description: string,
  referenceId?: string,
  type: TransactionType = TransactionType.CREDIT,
) {
  if (amount <= 0) {
    throw new AppError('Amount must be greater than zero', 400);
  }

  const wallet = await getWallet(userId);
  return applyWalletDelta(wallet, amount, type, description, referenceId);
}
