import { prisma } from '@/lib/db'
import { FX_MARKUP_DISCOUNT } from '@/lib/constants'
import type { SubscriptionTier } from '@prisma/client'

// Mock exchange rates for development (mid-market rates)
const MOCK_RATES: Record<string, number> = {
  'USD-INR': 83.25, 'USD-NPR': 133.50, 'USD-BDT': 110.50, 'USD-PKR': 278.50,
  'USD-PHP': 56.20, 'USD-MXN': 17.15, 'USD-BRL': 4.97, 'USD-GBP': 0.79,
  'USD-EUR': 0.92, 'USD-CAD': 1.36, 'USD-AUD': 1.53, 'USD-JPY': 149.50,
  'USD-CNY': 7.24, 'USD-KRW': 1325.0, 'USD-SGD': 1.34, 'USD-AED': 3.67,
  'USD-SAR': 3.75, 'USD-KES': 153.50, 'USD-NGN': 1550.0, 'USD-GHS': 12.80,
  'USD-ZAR': 18.65, 'USD-EGP': 30.90, 'USD-LKR': 323.0, 'USD-VND': 24500.0,
  'USD-THB': 35.50, 'USD-MYR': 4.72, 'USD-IDR': 15650.0, 'USD-TRY': 32.50,
  'GBP-INR': 105.50, 'GBP-NPR': 169.0, 'GBP-PKR': 353.0, 'GBP-BDT': 140.0,
  'EUR-INR': 90.50, 'EUR-NPR': 145.0, 'EUR-PKR': 303.0, 'EUR-BDT': 120.0,
  'CAD-INR': 61.20, 'CAD-NPR': 98.0, 'CAD-PKR': 205.0,
  'AUD-INR': 54.40, 'AUD-NPR': 87.20, 'AUD-PKR': 182.0,
  'AED-INR': 22.67, 'AED-NPR': 36.35, 'AED-PKR': 75.85,
  'SAR-INR': 22.20, 'SAR-NPR': 35.60, 'SAR-PKR': 74.27,
}

function getMockRate(send: string, receive: string): number | null {
  const key = `${send}-${receive}`
  if (MOCK_RATES[key]) return MOCK_RATES[key]

  const reverseKey = `${receive}-${send}`
  if (MOCK_RATES[reverseKey]) return 1 / MOCK_RATES[reverseKey]

  // Try cross via USD
  const sendToUsd = send === 'USD' ? 1 : MOCK_RATES[`USD-${send}`] ? 1 / MOCK_RATES[`USD-${send}`] : null
  const usdToReceive = receive === 'USD' ? 1 : MOCK_RATES[`USD-${receive}`] ?? null
  if (sendToUsd && usdToReceive) return sendToUsd * usdToReceive

  return null
}

export async function fetchMidMarketRate(
  sendCurrency: string,
  receiveCurrency: string
): Promise<number> {
  // Check cache first
  const cached = await prisma.exchangeRateCache.findFirst({
    where: {
      sendCurrency,
      receiveCurrency,
      expiresAt: { gt: new Date() },
    },
    orderBy: { fetchedAt: 'desc' },
  })

  if (cached) return Number(cached.midMarketRate)

  // Fetch from API or use mock
  let rate: number | null = null

  try {
    const apiKey = process.env.EXCHANGE_RATE_API_KEY
    if (apiKey && apiKey !== 'demo') {
      const res = await fetch(
        `${process.env.EXCHANGE_RATE_API_URL}/latest/${sendCurrency}`
      )
      const data = await res.json()
      rate = data.rates?.[receiveCurrency] ?? null
    }
  } catch {
    // Fall through to mock
  }

  if (!rate) {
    rate = getMockRate(sendCurrency, receiveCurrency)
  }

  if (!rate) {
    throw new Error(`No exchange rate available for ${sendCurrency}-${receiveCurrency}`)
  }

  // Cache for 60 seconds
  await prisma.exchangeRateCache.upsert({
    where: {
      sendCurrency_receiveCurrency_provider: {
        sendCurrency,
        receiveCurrency,
        provider: 'mock',
      },
    },
    update: {
      midMarketRate: rate,
      markedUpRate: rate,
      markupPercent: 0,
      fetchedAt: new Date(),
      expiresAt: new Date(Date.now() + 60_000),
    },
    create: {
      sendCurrency,
      receiveCurrency,
      midMarketRate: rate,
      markedUpRate: rate,
      markupPercent: 0,
      provider: 'mock',
      expiresAt: new Date(Date.now() + 60_000),
    },
  })

  return rate
}

export async function getCustomerRate(
  sendCurrency: string,
  receiveCurrency: string,
  subscriptionTier: SubscriptionTier = 'FREE'
): Promise<{
  customerRate: number
  midMarketRate: number
  markupPercent: number
  markupRevenuePerUnit: number
}> {
  const midMarketRate = await fetchMidMarketRate(sendCurrency, receiveCurrency)

  // Get corridor-specific markup
  const corridor = await prisma.corridor.findUnique({
    where: {
      sendCurrency_receiveCurrency: { sendCurrency, receiveCurrency },
    },
  })

  let baseMarkup = corridor ? Number(corridor.fxMarkupPercent) : 1.5

  // Apply subscription tier discount
  const tierDiscount = FX_MARKUP_DISCOUNT[subscriptionTier] || 0
  const effectiveMarkup = Math.max(0.1, baseMarkup - tierDiscount)

  // Customer gets a slightly worse rate (our revenue)
  const customerRate = midMarketRate * (1 - effectiveMarkup / 100)
  const markupRevenuePerUnit = midMarketRate - customerRate

  return {
    customerRate: Math.round(customerRate * 10000) / 10000,
    midMarketRate,
    markupPercent: effectiveMarkup,
    markupRevenuePerUnit,
  }
}
