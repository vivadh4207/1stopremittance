import { z } from 'zod'

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  country: z.string().length(2, 'Invalid country code'),
  phone: z.string().optional(),
  referralCode: z.string().optional(),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const recipientSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  country: z.string().length(2, 'Invalid country code'),
  currency: z.string().length(3, 'Invalid currency code'),
  deliveryMethod: z.enum(['BANK_DEPOSIT', 'MOBILE_WALLET', 'CASH_PICKUP', 'AIRTIME_TOPUP', 'HOME_DELIVERY']),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  routingCode: z.string().optional(),
  mobileNumber: z.string().optional(),
  pickupNetwork: z.string().optional(),
})

export const quoteSchema = z.object({
  sendCurrency: z.string().length(3),
  receiveCurrency: z.string().length(3),
  sendAmount: z.number().positive('Amount must be positive'),
  deliveryMethod: z.enum(['BANK_DEPOSIT', 'MOBILE_WALLET', 'CASH_PICKUP', 'AIRTIME_TOPUP', 'HOME_DELIVERY']),
  paymentMethod: z.enum(['DEBIT_CARD', 'CREDIT_CARD', 'BANK_TRANSFER', 'WALLET_BALANCE', 'APPLE_PAY', 'GOOGLE_PAY']),
})

export const transferSchema = z.object({
  quoteId: z.string().min(1),
  recipientId: z.string().min(1),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type RecipientInput = z.infer<typeof recipientSchema>
export type QuoteInput = z.infer<typeof quoteSchema>
export type TransferInput = z.infer<typeof transferSchema>
