import { create } from 'zustand'

interface Recipient {
  id?: string
  firstName: string
  lastName: string
  country: string
  currency: string
  deliveryMethod: string
  bankName?: string
  accountNumber?: string
  routingCode?: string
  mobileNumber?: string
  pickupNetwork?: string
}

interface SendFlowState {
  step: number
  recipient: Recipient | null
  sendAmount: number
  sendCurrency: string
  receiveCurrency: string
  receiveAmount: number
  exchangeRate: number
  deliveryMethod: string
  paymentMethod: string
  fee: number
  totalCost: number
  quoteId: string | null
  quoteExpiresAt: Date | null
  promoCode: string | null
  rewardPointsToUse: number

  setStep: (step: number) => void
  setRecipient: (recipient: Recipient) => void
  setAmounts: (data: {
    sendAmount: number
    receiveAmount: number
    exchangeRate: number
    fee: number
    totalCost: number
  }) => void
  setSendCurrency: (currency: string) => void
  setReceiveCurrency: (currency: string) => void
  setDeliveryMethod: (method: string) => void
  setPaymentMethod: (method: string) => void
  setQuote: (quoteId: string, expiresAt: Date) => void
  setPromoCode: (code: string | null) => void
  setRewardPoints: (points: number) => void
  reset: () => void
}

const initialState = {
  step: 1,
  recipient: null,
  sendAmount: 0,
  sendCurrency: 'USD',
  receiveCurrency: 'INR',
  receiveAmount: 0,
  exchangeRate: 0,
  deliveryMethod: 'BANK_DEPOSIT',
  paymentMethod: 'DEBIT_CARD',
  fee: 0,
  totalCost: 0,
  quoteId: null,
  quoteExpiresAt: null,
  promoCode: null,
  rewardPointsToUse: 0,
}

export const useSendFlowStore = create<SendFlowState>((set) => ({
  ...initialState,
  setStep: (step) => set({ step }),
  setRecipient: (recipient) => set({ recipient, receiveCurrency: recipient.currency }),
  setAmounts: (data) => set(data),
  setSendCurrency: (sendCurrency) => set({ sendCurrency }),
  setReceiveCurrency: (receiveCurrency) => set({ receiveCurrency }),
  setDeliveryMethod: (deliveryMethod) => set({ deliveryMethod }),
  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
  setQuote: (quoteId, quoteExpiresAt) => set({ quoteId, quoteExpiresAt }),
  setPromoCode: (promoCode) => set({ promoCode }),
  setRewardPoints: (rewardPointsToUse) => set({ rewardPointsToUse }),
  reset: () => set(initialState),
}))
