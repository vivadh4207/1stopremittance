import { prisma } from '@/lib/db'
import { RATE_LOCK_DURATION } from '@/lib/constants'
import { getCustomerRate } from './exchange-rate.service'
import { calculateFee } from './fee-calculator.service'
import type { DeliveryMethod, PaymentMethod, SubscriptionTier } from '@prisma/client'

export async function createQuote(
  userId: string,
  sendCurrency: string,
  receiveCurrency: string,
  sendAmount: number,
  deliveryMethod: DeliveryMethod,
  paymentMethod: PaymentMethod,
  subscriptionTier: SubscriptionTier = 'FREE'
) {
  // Get the rate with markup
  const rateResult = await getCustomerRate(sendCurrency, receiveCurrency, subscriptionTier)

  // Calculate fees
  const feeResult = await calculateFee(
    sendCurrency,
    receiveCurrency,
    sendAmount,
    deliveryMethod,
    paymentMethod,
    subscriptionTier
  )

  // Calculate receive amount
  const receiveAmount = Math.round(sendAmount * rateResult.customerRate * 100) / 100

  // FX markup revenue = (midMarketRate - customerRate) * sendAmount
  const fxMarkupEarned = Math.round(
    (rateResult.midMarketRate - rateResult.customerRate) * sendAmount * 100
  ) / 100

  // Total cost to customer
  const totalCost = Math.round((sendAmount + feeResult.finalFee) * 100) / 100

  // Rate lock duration based on subscription tier
  const lockDuration = RATE_LOCK_DURATION[subscriptionTier] || RATE_LOCK_DURATION.FREE
  const expiresAt = new Date(Date.now() + lockDuration)

  // Find corridor
  const corridor = await prisma.corridor.findUnique({
    where: {
      sendCurrency_receiveCurrency: { sendCurrency, receiveCurrency },
    },
  })

  if (!corridor) {
    throw new Error(`Corridor not available: ${sendCurrency} to ${receiveCurrency}`)
  }

  // Validate limits
  if (sendAmount < Number(corridor.minTransferAmount)) {
    throw new Error(`Minimum transfer amount is ${corridor.minTransferAmount} ${sendCurrency}`)
  }
  if (sendAmount > Number(corridor.maxTransferAmount)) {
    throw new Error(`Maximum transfer amount is ${corridor.maxTransferAmount} ${sendCurrency}`)
  }

  const quote = await prisma.quote.create({
    data: {
      userId,
      corridorId: corridor.id,
      sendAmount,
      sendCurrency,
      receiveAmount,
      receiveCurrency,
      exchangeRate: rateResult.customerRate,
      midMarketRate: rateResult.midMarketRate,
      fxMarkupEarned,
      fee: feeResult.finalFee,
      totalCost,
      deliveryMethod,
      paymentMethod,
      expiresAt,
    },
  })

  return {
    id: quote.id,
    sendAmount,
    sendCurrency,
    receiveAmount,
    receiveCurrency,
    exchangeRate: rateResult.customerRate,
    midMarketRate: rateResult.midMarketRate,
    fee: feeResult.finalFee,
    feeBreakdown: feeResult,
    totalCost,
    deliveryMethod,
    paymentMethod,
    expiresAt,
  }
}

export async function getQuote(quoteId: string) {
  const quote = await prisma.quote.findUnique({
    where: { id: quoteId },
  })

  if (!quote) throw new Error('Quote not found')
  if (quote.status !== 'ACTIVE') throw new Error('Quote is no longer active')
  if (new Date() > quote.expiresAt) {
    await prisma.quote.update({
      where: { id: quoteId },
      data: { status: 'EXPIRED' },
    })
    throw new Error('Quote has expired')
  }

  return quote
}
