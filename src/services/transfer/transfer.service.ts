import { prisma } from '@/lib/db'
import { generateReferenceNumber } from '@/lib/utils'
import { getQuote } from '../pricing/quote.service'

export async function createTransfer(userId: string, quoteId: string, recipientId: string) {
  const quote = await getQuote(quoteId)

  if (quote.userId !== userId) {
    throw new Error('Unauthorized: quote belongs to another user')
  }

  const recipient = await prisma.recipient.findFirst({
    where: { id: recipientId, userId, isActive: true },
  })

  if (!recipient) throw new Error('Recipient not found')

  const referenceNumber = generateReferenceNumber()

  const transfer = await prisma.$transaction(async (tx) => {
    // Mark quote as converted
    await tx.quote.update({
      where: { id: quoteId },
      data: { status: 'CONVERTED' },
    })

    // Create transfer
    const newTransfer = await tx.transfer.create({
      data: {
        referenceNumber,
        userId,
        recipientId,
        corridorId: quote.corridorId,
        quoteId,
        sendAmount: quote.sendAmount,
        sendCurrency: quote.sendCurrency,
        receiveAmount: quote.receiveAmount,
        receiveCurrency: quote.receiveCurrency,
        exchangeRate: quote.exchangeRate,
        fee: quote.fee,
        totalCharged: quote.totalCost,
        deliveryMethod: quote.deliveryMethod,
        paymentMethod: quote.paymentMethod,
        fxMarkupRevenue: quote.fxMarkupEarned,
        feeRevenue: quote.fee,
        totalRevenue: Number(quote.fxMarkupEarned) + Number(quote.fee),
        status: 'INITIATED',
        complianceFlags: [],
      },
    })

    // Create initial status log
    await tx.transferStatusLog.create({
      data: {
        transferId: newTransfer.id,
        status: 'INITIATED',
        notes: 'Transfer initiated',
        actor: 'system',
      },
    })

    return newTransfer
  })

  return {
    id: transfer.id,
    referenceNumber: transfer.referenceNumber,
    status: transfer.status,
    sendAmount: Number(transfer.sendAmount),
    sendCurrency: transfer.sendCurrency,
    receiveAmount: Number(transfer.receiveAmount),
    receiveCurrency: transfer.receiveCurrency,
    fee: Number(transfer.fee),
    totalCharged: Number(transfer.totalCharged),
    exchangeRate: Number(transfer.exchangeRate),
    deliveryMethod: transfer.deliveryMethod,
    createdAt: transfer.createdAt,
  }
}

export async function getTransfersByUser(userId: string, page = 1, limit = 20) {
  const [transfers, total] = await Promise.all([
    prisma.transfer.findMany({
      where: { userId },
      include: { recipient: true },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.transfer.count({ where: { userId } }),
  ])

  return {
    transfers: transfers.map((t) => ({
      id: t.id,
      referenceNumber: t.referenceNumber,
      status: t.status,
      sendAmount: Number(t.sendAmount),
      sendCurrency: t.sendCurrency,
      receiveAmount: Number(t.receiveAmount),
      receiveCurrency: t.receiveCurrency,
      fee: Number(t.fee),
      totalCharged: Number(t.totalCharged),
      exchangeRate: Number(t.exchangeRate),
      deliveryMethod: t.deliveryMethod,
      recipientName: `${t.recipient.firstName} ${t.recipient.lastName}`,
      createdAt: t.createdAt,
    })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  }
}

export async function updateTransferStatus(
  transferId: string,
  status: string,
  actor: string,
  notes?: string
) {
  return prisma.$transaction(async (tx) => {
    const transfer = await tx.transfer.update({
      where: { id: transferId },
      data: {
        status: status as never,
        ...(status === 'COMPLETED' ? { completedAt: new Date() } : {}),
        ...(status === 'CANCELLED' ? { cancelledAt: new Date() } : {}),
      },
    })

    await tx.transferStatusLog.create({
      data: {
        transferId,
        status: status as never,
        notes,
        actor,
      },
    })

    return transfer
  })
}
