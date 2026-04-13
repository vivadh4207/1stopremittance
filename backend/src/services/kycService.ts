import { DocType } from '@prisma/client';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';

interface SubmitKYCData {
  docType: DocType;
  docNumber: string;
  frontImageUrl: string;
  backImageUrl?: string;
  selfieUrl?: string;
}

export async function submitKYC(userId: string, data: SubmitKYCData) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError('User not found', 404);

  if (user.kycStatus === 'APPROVED') {
    throw new AppError('KYC already approved', 400);
  }

  // Check for existing pending/submitted document of same type
  const existingDoc = await prisma.kYCDocument.findFirst({
    where: { userId, docType: data.docType, status: { in: ['PENDING', 'APPROVED'] } },
  });

  if (existingDoc) {
    throw new AppError(`A ${data.docType} document is already ${existingDoc.status.toLowerCase()}`, 400);
  }

  const kycDoc = await prisma.kYCDocument.create({
    data: {
      userId,
      docType: data.docType,
      docNumber: data.docNumber,
      frontImageUrl: data.frontImageUrl,
      backImageUrl: data.backImageUrl,
      selfieUrl: data.selfieUrl,
      status: 'PENDING',
    },
  });

  // Update user KYC status to SUBMITTED
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { kycStatus: 'SUBMITTED' },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      kycStatus: true,
    },
  });

  return { kycDoc, user: updatedUser };
}

export async function getKYCStatus(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      kycStatus: true,
      kycDocuments: {
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          docType: true,
          docNumber: true,
          status: true,
          reviewedAt: true,
          reviewNotes: true,
          createdAt: true,
        },
      },
    },
  });

  if (!user) throw new AppError('User not found', 404);

  return {
    kycStatus: user.kycStatus,
    documents: user.kycDocuments,
    isApproved: user.kycStatus === 'APPROVED',
    canTransferLargeAmounts: user.kycStatus === 'APPROVED',
  };
}

export async function reviewKYC(
  docId: string,
  status: 'APPROVED' | 'REJECTED',
  reviewNotes?: string,
) {
  const doc = await prisma.kYCDocument.findUnique({
    where: { id: docId },
    include: { user: true },
  });

  if (!doc) throw new AppError('KYC document not found', 404);

  const updatedDoc = await prisma.kYCDocument.update({
    where: { id: docId },
    data: { status, reviewNotes, reviewedAt: new Date() },
  });

  // Update user KYC status based on document status
  let userKycStatus: 'APPROVED' | 'REJECTED' | 'SUBMITTED' = 'SUBMITTED';
  if (status === 'APPROVED') {
    userKycStatus = 'APPROVED';
  } else if (status === 'REJECTED') {
    // Check if user has any other approved docs
    const approvedDocs = await prisma.kYCDocument.count({
      where: { userId: doc.userId, status: 'APPROVED', id: { not: docId } },
    });
    userKycStatus = approvedDocs > 0 ? 'APPROVED' : 'REJECTED';
  }

  await prisma.user.update({
    where: { id: doc.userId },
    data: { kycStatus: userKycStatus },
  });

  return updatedDoc;
}
