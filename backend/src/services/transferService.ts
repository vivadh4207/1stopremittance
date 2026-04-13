import { Decimal } from '@prisma/client/runtime/library';
import { TransactionType, TransferStatus } from '@prisma/client';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { PaginationParams, buildPaginationMeta } from '../utils/pagination';
import { getRate } from './exchangeRateService';
import { calculateFee } from './feeService';
import { debitWallet, creditWallet } from './walletService';
import { config } from '../config/env';

interface QuoteData {
  sendAmount: number;
  sendCurrency: string;
  receiveCurrency: string;
  recipientCountry: string;
}

interface QuoteResult {
  sendAmount: number;
  sendCurrency: string;
  receiveAmount: number;
  receiveCurrency: string;
  exchangeRate: number;
  midMarketRate: number;
  fee: number;
  feeBreakdown: { percentageFee: number; flatFee: number; feePercentage: number };
  totalDeducted: number;
  estimatedDelivery: string;
}

interface CreateTransferData {
  sendAmount: number;
  sendCurrency: string;
  receiveCurrency: string;
  recipientFirstName: string;
  recipientLastName: string;
  recipientEmail?: string;
  recipientPhone?: string;
  recipientCountry: string;
  recipientBankName?: string;
  recipientAccountNumber?: string;
  recipientRoutingNumber?: string;
  purposeCode?: string;
  notes?: string;
}

export async function quote(
  senderId: string,
  data: QuoteData,
): Promise<QuoteResult> {
  const user = await prisma.user.findUnique({ where: { id: senderId } });
  if (!user) throw new AppError('User not found', 404);

  const { sendAmount, sendCurrency, receiveCurrency } = data;
  if (sendAmount <= 0) throw new AppError('Send amount must be greater than zero', 400);

  // KYC check for large transfers
  if (
    sendAmount > config.kycTransferLimit &&
    user.kycStatus !== 'APPROVED'
  ) {
    throw new AppError(
      `KYC verification required for transfers above $${config.kycTransferLimit}`,
      403,
    );
  }

  const rateData = await getRate(sendCurrency, receiveCurrency);
  const feeBreakdown = calculateFee(sendAmount);
  const receiveAmount = (sendAmount - feeBreakdown.fee) * rateData.customerRate;
  const totalDeducted = sendAmount;

  return {
    sendAmount,
    sendCurrency: sendCurrency.toUpperCase(),
    receiveAmount: Math.round(receiveAmount * 100) / 100,
    receiveCurrency: receiveCurrency.toUpperCase(),
    exchangeRate: rateData.customerRate,
    midMarketRate: rateData.midMarketRate,
    fee: feeBreakdown.fee,
    feeBreakdown: {
      percentageFee: feeBreakdown.percentageFee,
      flatFee: feeBreakdown.flatFee,
      feePercentage: feeBreakdown.feePercentage,
    },
    totalDeducted,
    estimatedDelivery: '1-2 business days',
  };
}

export async function createTransfer(senderId: string, data: CreateTransferData) {
  const user = await prisma.user.findUnique({ where: { id: senderId } });
  if (!user) throw new AppError('User not found', 404);

  if (
    data.sendAmount > config.kycTransferLimit &&
    user.kycStatus !== 'APPROVED'
  ) {
    throw new AppError(
      `KYC verification required for transfers above $${config.kycTransferLimit}`,
      403,
    );
  }

  const rateData = await getRate(data.sendCurrency, data.receiveCurrency);
  const feeBreakdown = calculateFee(data.sendAmount);
  const receiveAmount = (data.sendAmount - feeBreakdown.fee) * rateData.customerRate;
  const totalDeducted = data.sendAmount;

  const transfer = await prisma.transfer.create({
    data: {
      senderId,
      recipientFirstName: data.recipientFirstName,
      recipientLastName: data.recipientLastName,
      recipientEmail: data.recipientEmail,
      recipientPhone: data.recipientPhone,
      recipientCountry: data.recipientCountry,
      recipientBankName: data.recipientBankName,
      recipientAccountNumber: data.recipientAccountNumber,
      recipientRoutingNumber: data.recipientRoutingNumber,
      sendAmount: new Decimal(data.sendAmount),
      sendCurrency: data.sendCurrency.toUpperCase(),
      receiveAmount: new Decimal(Math.round(receiveAmount * 100) / 100),
      receiveCurrency: data.receiveCurrency.toUpperCase(),
      exchangeRate: new Decimal(rateData.customerRate),
      fee: new Decimal(feeBreakdown.fee),
      totalDeducted: new Decimal(totalDeducted),
      purposeCode: data.purposeCode,
      notes: data.notes,
    },
  });

  return transfer;
}

export async function processTransfer(transferId: string) {
  const transfer = await prisma.transfer.findUnique({ where: { id: transferId } });
  if (!transfer) throw new AppError('Transfer not found', 404);

  if (transfer.status !== TransferStatus.PENDING) {
    throw new AppError(`Transfer cannot be processed in status: ${transfer.status}`, 400);
  }

  // Debit the sender's wallet
  await debitWallet(
    transfer.senderId,
    Number(transfer.totalDeducted),
    `Transfer to ${transfer.recipientFirstName} ${transfer.recipientLastName}`,
    transfer.id,
    TransactionType.TRANSFER_OUT,
  );

  // Record fee transaction if applicable
  if (Number(transfer.fee) > 0) {
    const wallet = await prisma.wallet.findUnique({ where: { userId: transfer.senderId } });
    if (wallet) {
      const currentBalance = Number(wallet.balance);
      await prisma.transaction.create({
        data: {
          walletId: wallet.id,
          type: TransactionType.FEE,
          amount: transfer.fee,
          currency: transfer.sendCurrency,
          balanceBefore: new Decimal(currentBalance + Number(transfer.fee)),
          balanceAfter: new Decimal(currentBalance),
          description: 'Transfer fee',
          referenceId: transfer.id,
        },
      });
    }
  }

  const updated = await prisma.transfer.update({
    where: { id: transferId },
    data: { status: TransferStatus.PROCESSING },
  });

  return updated;
}

export async function completeTransfer(transferId: string) {
  const transfer = await prisma.transfer.findUnique({ where: { id: transferId } });
  if (!transfer) throw new AppError('Transfer not found', 404);

  if (
    transfer.status !== TransferStatus.PROCESSING &&
    transfer.status !== TransferStatus.PENDING
  ) {
    throw new AppError(`Transfer cannot be completed in status: ${transfer.status}`, 400);
  }

  // If still pending, debit wallet first
  if (transfer.status === TransferStatus.PENDING) {
    await processTransfer(transferId);
  }

  const updated = await prisma.transfer.update({
    where: { id: transferId },
    data: { status: TransferStatus.COMPLETED, completedAt: new Date() },
  });

  return updated;
}

export async function failTransfer(transferId: string, reason?: string) {
  const transfer = await prisma.transfer.findUnique({ where: { id: transferId } });
  if (!transfer) throw new AppError('Transfer not found', 404);

  if (transfer.status === TransferStatus.COMPLETED) {
    throw new AppError('Cannot fail a completed transfer', 400);
  }

  // If funds were debited, refund them
  if (transfer.status === TransferStatus.PROCESSING) {
    await creditWallet(
      transfer.senderId,
      Number(transfer.totalDeducted),
      reason ?? 'Transfer failed - refund',
      transfer.id,
      TransactionType.REFUND,
    );
  }

  const updated = await prisma.transfer.update({
    where: { id: transferId },
    data: { status: TransferStatus.FAILED, notes: reason ?? transfer.notes },
  });

  return updated;
}

export async function getTransfers(userId: string, pagination: PaginationParams) {
  const [transfers, total] = await Promise.all([
    prisma.transfer.findMany({
      where: { senderId: userId },
      orderBy: { createdAt: 'desc' },
      skip: pagination.skip,
      take: pagination.take,
    }),
    prisma.transfer.count({ where: { senderId: userId } }),
  ]);

  return {
    transfers,
    meta: buildPaginationMeta(total, pagination.page, pagination.limit),
  };
}

export async function getTransfer(transferId: string, userId: string) {
  const transfer = await prisma.transfer.findFirst({
    where: { id: transferId, senderId: userId },
  });

  if (!transfer) throw new AppError('Transfer not found', 404);

  return transfer;
}
