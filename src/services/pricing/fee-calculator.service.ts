import { prisma } from '@/lib/db'
import { FEE_DISCOUNT_PERCENT } from '@/lib/constants'
import type { DeliveryMethod, PaymentMethod, SubscriptionTier } from '@/generated/prisma'

interface FeeResult {
  baseFee: number
  discounts: { type: string; amount: number }[]
  finalFee: number
  revenueFromFee: number
}

// Default fee table when no database tiers are configured
const DEFAULT_FEES: Record<string, { fixed: number; percent: number }> = {
  'BANK_TRANSFER-BANK_DEPOSIT': { fixed: 0.99, percent: 0 },
  'BANK_TRANSFER-MOBILE_WALLET': { fixed: 1.49, percent: 0 },
  'BANK_TRANSFER-CASH_PICKUP': { fixed: 1.99, percent: 0 },
  'DEBIT_CARD-BANK_DEPOSIT': { fixed: 2.99, percent: 0 },
  'DEBIT_CARD-MOBILE_WALLET': { fixed: 3.49, percent: 0 },
  'DEBIT_CARD-CASH_PICKUP': { fixed: 3.99, percent: 0 },
  'CREDIT_CARD-BANK_DEPOSIT': { fixed: 4.99, percent: 1.5 },
  'CREDIT_CARD-MOBILE_WALLET': { fixed: 4.99, percent: 1.5 },
  'CREDIT_CARD-CASH_PICKUP': { fixed: 5.99, percent: 1.5 },
  'WALLET_BALANCE-BANK_DEPOSIT': { fixed: 0.49, percent: 0 },
  'WALLET_BALANCE-MOBILE_WALLET': { fixed: 0.49, percent: 0 },
  'WALLET_BALANCE-CASH_PICKUP': { fixed: 0.99, percent: 0 },
  'APPLE_PAY-BANK_DEPOSIT': { fixed: 2.99, percent: 0 },
  'GOOGLE_PAY-BANK_DEPOSIT': { fixed: 2.99, percent: 0 },
}

export async function calculateFee(
  sendCurrency: string,
  receiveCurrency: string,
  sendAmount: number,
  deliveryMethod: DeliveryMethod,
  paymentMethod: PaymentMethod,
  subscriptionTier: SubscriptionTier = 'FREE',
  promoCode?: string,
  rewardPointsToRedeem: number = 0
): Promise<FeeResult> {
  const discounts: FeeResult['discounts'] = []

  // Try database fee tiers first
  const corridor = await prisma.corridor.findUnique({
    where: {
      sendCurrency_receiveCurrency: { sendCurrency, receiveCurrency },
    },
  })

  let baseFee = 0

  if (corridor) {
    const tier = await prisma.feeTier.findFirst({
      where: {
        corridorId: corridor.id,
        deliveryMethod,
        paymentMethod,
        subscriptionTier,
        isActive: true,
        minAmount: { lte: sendAmount },
        maxAmount: { gte: sendAmount },
      },
    })

    if (tier) {
      switch (tier.feeType) {
        case 'FIXED':
          baseFee = Number(tier.feeValue)
          break
        case 'PERCENTAGE':
          baseFee = sendAmount * Number(tier.feeValue) / 100
          break
        case 'HYBRID':
          baseFee = Number(tier.feeValue) + sendAmount * 0.5 / 100
          break
      }
    }
  }

  // Fall back to default fees
  if (baseFee === 0) {
    const key = `${paymentMethod}-${deliveryMethod}`
    const defaultFee = DEFAULT_FEES[key] || { fixed: 3.99, percent: 0 }
    baseFee = defaultFee.fixed + (sendAmount * defaultFee.percent / 100)
  }

  // Amount-based tier adjustments
  if (sendAmount >= 5000) {
    const volumeDiscount = baseFee * 0.1
    baseFee -= volumeDiscount
    discounts.push({ type: 'Volume discount', amount: volumeDiscount })
  } else if (sendAmount >= 1000) {
    const volumeDiscount = baseFee * 0.05
    baseFee -= volumeDiscount
    discounts.push({ type: 'Volume discount', amount: volumeDiscount })
  }

  // Subscription tier discount
  const tierDiscountPercent = FEE_DISCOUNT_PERCENT[subscriptionTier] || 0
  if (tierDiscountPercent > 0) {
    const tierDiscount = baseFee * tierDiscountPercent / 100
    discounts.push({ type: `${subscriptionTier} member discount`, amount: tierDiscount })
    baseFee -= tierDiscount
  }

  // Promo code discount
  if (promoCode) {
    const promo = await prisma.corridorPromotion.findFirst({
      where: {
        promoCode,
        isActive: true,
        startsAt: { lte: new Date() },
        endsAt: { gte: new Date() },
        OR: [
          { maxUses: null },
          { currentUses: { lt: prisma.corridorPromotion.fields.maxUses } },
        ],
      },
    })

    if (promo) {
      let promoDiscount = 0
      switch (promo.type) {
        case 'FEE_DISCOUNT_FIXED':
          promoDiscount = Math.min(Number(promo.value), baseFee)
          break
        case 'FEE_DISCOUNT_PERCENT':
          promoDiscount = baseFee * Number(promo.value) / 100
          break
        case 'FREE_TRANSFER':
          promoDiscount = baseFee
          break
      }
      if (promoDiscount > 0) {
        discounts.push({ type: `Promo: ${promoCode}`, amount: promoDiscount })
        baseFee -= promoDiscount
      }
    }
  }

  // Reward points redemption (100 points = $1)
  if (rewardPointsToRedeem > 0) {
    const pointsValue = rewardPointsToRedeem / 100
    const pointsDiscount = Math.min(pointsValue, baseFee)
    if (pointsDiscount > 0) {
      discounts.push({ type: 'Reward points', amount: pointsDiscount })
      baseFee -= pointsDiscount
    }
  }

  const finalFee = Math.max(0, Math.round(baseFee * 100) / 100)

  return {
    baseFee: Math.round((finalFee + discounts.reduce((sum, d) => sum + d.amount, 0)) * 100) / 100,
    discounts,
    finalFee,
    revenueFromFee: finalFee,
  }
}
