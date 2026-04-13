export const APP_NAME = '1StopRemittance'
export const APP_DESCRIPTION = 'Send money worldwide with the best rates and lowest fees'

export const RATE_LOCK_DURATION = {
  FREE: 15 * 60 * 1000,      // 15 minutes
  PLUS: 30 * 60 * 1000,      // 30 minutes
  PREMIUM: 60 * 60 * 1000,   // 60 minutes
  BUSINESS: 120 * 60 * 1000, // 120 minutes
} as const

export const SUBSCRIPTION_PRICES = {
  FREE: 0,
  PLUS: 4.99,
  PREMIUM: 14.99,
  BUSINESS: 49.99,
} as const

export const FX_MARKUP_DISCOUNT = {
  FREE: 0,
  PLUS: 0.2,
  PREMIUM: 0.5,
  BUSINESS: 0.8,
} as const

export const FEE_DISCOUNT_PERCENT = {
  FREE: 0,
  PLUS: 15,
  PREMIUM: 40,
  BUSINESS: 60,
} as const

export const REWARD_POINTS_MULTIPLIER = {
  FREE: 1,
  PLUS: 1.5,
  PREMIUM: 2,
  BUSINESS: 3,
} as const

export const POINTS_PER_100_USD = 10
export const POINTS_TO_DOLLAR = 100 // 100 points = $1

export const DAILY_LIMITS = {
  FREE: 2500,
  PLUS: 5000,
  PREMIUM: 25000,
  BUSINESS: 100000,
} as const

export const TRANSFER_STATUS_LABELS: Record<string, string> = {
  INITIATED: 'Initiated',
  PAYMENT_PENDING: 'Awaiting Payment',
  PAYMENT_RECEIVED: 'Payment Received',
  COMPLIANCE_REVIEW: 'Under Review',
  COMPLIANCE_HOLD: 'On Hold',
  PROCESSING: 'Processing',
  SENT_TO_PARTNER: 'Sent to Partner',
  IN_TRANSIT: 'In Transit',
  AVAILABLE_FOR_PICKUP: 'Ready for Pickup',
  DELIVERED: 'Delivered',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  REFUNDED: 'Refunded',
  FAILED: 'Failed',
}

export const DELIVERY_METHOD_LABELS: Record<string, string> = {
  BANK_DEPOSIT: 'Bank Deposit',
  MOBILE_WALLET: 'Mobile Wallet',
  CASH_PICKUP: 'Cash Pickup',
  AIRTIME_TOPUP: 'Airtime Top-up',
  HOME_DELIVERY: 'Home Delivery',
}

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  DEBIT_CARD: 'Debit Card',
  CREDIT_CARD: 'Credit Card',
  BANK_TRANSFER: 'Bank Transfer (ACH)',
  WALLET_BALANCE: 'Wallet Balance',
  APPLE_PAY: 'Apple Pay',
  GOOGLE_PAY: 'Google Pay',
}
