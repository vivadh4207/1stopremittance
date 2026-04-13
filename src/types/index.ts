export type { DeliveryMethod, PaymentMethod, TransferStatus, SubscriptionTier, UserRole, KycStatus } from '@prisma/client'

export interface ExchangeRateResult {
  customerRate: number
  midMarketRate: number
  markupPercent: number
  markupRevenue: number
  sendCurrency: string
  receiveCurrency: string
}

export interface FeeCalculationResult {
  baseFee: number
  discounts: { type: string; amount: number }[]
  finalFee: number
  revenueFromFee: number
}

export interface QuoteResult {
  id: string
  sendAmount: number
  sendCurrency: string
  receiveAmount: number
  receiveCurrency: string
  exchangeRate: number
  fee: number
  totalCost: number
  deliveryMethod: string
  paymentMethod: string
  expiresAt: Date
}

export interface TransferResult {
  id: string
  referenceNumber: string
  status: string
  sendAmount: number
  sendCurrency: string
  receiveAmount: number
  receiveCurrency: string
  fee: number
  totalCharged: number
  exchangeRate: number
  deliveryMethod: string
  recipientName: string
  createdAt: Date
}

export interface CorridorInfo {
  id: string
  sendCountry: string
  receiveCountry: string
  sendCurrency: string
  receiveCurrency: string
  fxMarkupPercent: number
  minTransferAmount: number
  maxTransferAmount: number
  deliveryMethods: string[]
}

export interface RevenueAnalytics {
  totalRevenue: number
  fxRevenue: number
  feeRevenue: number
  totalTransfers: number
  avgRevenuePerTransfer: number
  conversionRate: number
  topCorridors: { corridor: string; revenue: number; volume: number }[]
  dailyRevenue: { date: string; revenue: number; transfers: number }[]
}

export interface CountryOption {
  id: string
  name: string
  currency: string
  flagEmoji: string
  phoneCode: string
}
