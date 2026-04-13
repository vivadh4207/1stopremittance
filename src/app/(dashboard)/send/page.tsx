'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useSendFlowStore } from '@/stores/send-flow.store'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select } from '@/components/ui/select'
import { formatCurrency } from '@/lib/utils'
import { DELIVERY_METHOD_LABELS, PAYMENT_METHOD_LABELS } from '@/lib/constants'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  CreditCard,
  Building2,
  Wallet,
  Smartphone,
  UserPlus,
  Copy,
  Share2,
  Banknote,
  Globe,
  Tag,
} from 'lucide-react'

const steps = [
  { id: 1, label: 'Recipient' },
  { id: 2, label: 'Amount' },
  { id: 3, label: 'Payment' },
  { id: 4, label: 'Review' },
  { id: 5, label: 'Complete' },
]

const savedRecipients = [
  { id: 'r1', firstName: 'Ramesh', lastName: 'Sharma', country: 'NP', currency: 'NPR', deliveryMethod: 'BANK_DEPOSIT', bankName: 'Nepal Bank Ltd', accountNumber: '****4521', flag: '\u{1F1F3}\u{1F1F5}' },
  { id: 'r2', firstName: 'Priya', lastName: 'Patel', country: 'IN', currency: 'INR', deliveryMethod: 'BANK_DEPOSIT', bankName: 'State Bank of India', accountNumber: '****8832', flag: '\u{1F1EE}\u{1F1F3}' },
  { id: 'r3', firstName: 'Maria', lastName: 'Santos', country: 'PH', currency: 'PHP', deliveryMethod: 'MOBILE_WALLET', mobileNumber: '+63 917 ***4567', flag: '\u{1F1F5}\u{1F1ED}' },
  { id: 'r4', firstName: 'Ahmed', lastName: 'Khan', country: 'PK', currency: 'PKR', deliveryMethod: 'CASH_PICKUP', pickupNetwork: 'JazzCash', flag: '\u{1F1F5}\u{1F1F0}' },
]

const deliveryMethods = [
  { value: 'BANK_DEPOSIT', label: 'Bank Deposit', icon: Building2, eta: '1-2 business days' },
  { value: 'MOBILE_WALLET', label: 'Mobile Wallet', icon: Smartphone, eta: 'Within minutes' },
  { value: 'CASH_PICKUP', label: 'Cash Pickup', icon: Banknote, eta: 'Within hours' },
]

const paymentMethods = [
  { value: 'DEBIT_CARD', label: 'Debit Card', icon: CreditCard, fee: 1.99, desc: 'Instant processing' },
  { value: 'CREDIT_CARD', label: 'Credit Card', icon: CreditCard, fee: 3.99, desc: '+ card cash advance fee may apply' },
  { value: 'BANK_TRANSFER', label: 'Bank Transfer (ACH)', icon: Building2, fee: 0.00, desc: '2-3 business days' },
  { value: 'WALLET_BALANCE', label: 'Wallet Balance', icon: Wallet, fee: 0.00, desc: 'Available: $1,245.50' },
]

// Mock exchange rates
const rates: Record<string, number> = {
  NPR: 133.75,
  INR: 83.45,
  PHP: 56.30,
  PKR: 278.90,
  BDT: 109.80,
  MXN: 17.25,
  NGN: 1550.00,
}

function Stepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((s, i) => (
        <div key={s.id} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                currentStep > s.id
                  ? 'bg-green-500 text-white'
                  : currentStep === s.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {currentStep > s.id ? <Check className="w-4 h-4" /> : s.id}
            </div>
            <span className={`text-xs mt-1 hidden sm:block ${currentStep >= s.id ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-12 sm:w-20 h-0.5 mx-1 ${currentStep > s.id ? 'bg-green-500' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

function StepRecipient() {
  const { setRecipient, setStep, setDeliveryMethod } = useSendFlowStore()

  const handleSelect = (recipient: typeof savedRecipients[0]) => {
    setRecipient({
      id: recipient.id,
      firstName: recipient.firstName,
      lastName: recipient.lastName,
      country: recipient.country,
      currency: recipient.currency,
      deliveryMethod: recipient.deliveryMethod,
      bankName: recipient.bankName,
      accountNumber: recipient.accountNumber,
      mobileNumber: recipient.mobileNumber,
      pickupNetwork: recipient.pickupNetwork,
    })
    setDeliveryMethod(recipient.deliveryMethod)
    setStep(2)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-900 mb-1">Who are you sending to?</h2>
      <p className="text-sm text-gray-500 mb-6">Select a saved recipient or add a new one</p>

      <div className="space-y-3 mb-6">
        {savedRecipients.map((r) => (
          <button
            key={r.id}
            onClick={() => handleSelect(r)}
            className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all text-left"
          >
            <span className="text-3xl">{r.flag}</span>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{r.firstName} {r.lastName}</p>
              <p className="text-sm text-gray-500">
                {DELIVERY_METHOD_LABELS[r.deliveryMethod]} &middot; {r.bankName || r.mobileNumber || r.pickupNetwork}
              </p>
            </div>
            <Badge variant="outline">{r.currency}</Badge>
          </button>
        ))}
      </div>

      <Link href="/recipients">
        <Button variant="outline" className="w-full gap-2">
          <UserPlus className="w-4 h-4" />
          Add New Recipient
        </Button>
      </Link>
    </div>
  )
}

function StepAmount() {
  const {
    sendAmount, receiveAmount, exchangeRate, sendCurrency, receiveCurrency,
    deliveryMethod, fee, totalCost, recipient,
    setAmounts, setDeliveryMethod, setStep,
  } = useSendFlowStore()

  const rate = rates[receiveCurrency] || 83.45

  const handleSendAmountChange = (value: string) => {
    const amount = parseFloat(value) || 0
    const selectedFee = paymentMethods.find(p => p.value === 'DEBIT_CARD')?.fee || 1.99
    setAmounts({
      sendAmount: amount,
      receiveAmount: Math.round(amount * rate * 100) / 100,
      exchangeRate: rate,
      fee: selectedFee,
      totalCost: amount + selectedFee,
    })
  }

  const handleReceiveAmountChange = (value: string) => {
    const receiveAmt = parseFloat(value) || 0
    const sendAmt = Math.round((receiveAmt / rate) * 100) / 100
    const selectedFee = paymentMethods.find(p => p.value === 'DEBIT_CARD')?.fee || 1.99
    setAmounts({
      sendAmount: sendAmt,
      receiveAmount: receiveAmt,
      exchangeRate: rate,
      fee: selectedFee,
      totalCost: sendAmt + selectedFee,
    })
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-900 mb-1">How much are you sending?</h2>
      <p className="text-sm text-gray-500 mb-6">
        Sending to {recipient?.firstName} {recipient?.lastName} in {receiveCurrency}
      </p>

      <Card className="mb-6">
        <CardContent className="p-6 space-y-4">
          {/* You send */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">You send</label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="0.00"
                value={sendAmount || ''}
                onChange={(e) => handleSendAmountChange(e.target.value)}
                className="flex-1 text-lg"
              />
              <div className="flex items-center gap-2 px-4 bg-gray-50 rounded-lg border border-gray-200 text-sm font-medium text-gray-700">
                {sendCurrency}
              </div>
            </div>
          </div>

          {/* Rate info */}
          <div className="flex items-center justify-center gap-2 py-2">
            <div className="flex-1 h-px bg-gray-200" />
            <div className="flex items-center gap-2 text-sm bg-green-50 text-green-700 px-3 py-1 rounded-full">
              <Globe className="w-3.5 h-3.5" />
              1 {sendCurrency} = {rate.toFixed(4)} {receiveCurrency}
            </div>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* They receive */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">They receive</label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="0.00"
                value={receiveAmount || ''}
                onChange={(e) => handleReceiveAmountChange(e.target.value)}
                className="flex-1 text-lg"
              />
              <div className="flex items-center gap-2 px-4 bg-gray-50 rounded-lg border border-gray-200 text-sm font-medium text-gray-700">
                {receiveCurrency}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delivery method */}
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Delivery Method</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {deliveryMethods.map((m) => {
          const Icon = m.icon
          const selected = deliveryMethod === m.value
          return (
            <button
              key={m.value}
              onClick={() => setDeliveryMethod(m.value)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Icon className={`w-5 h-5 mb-2 ${selected ? 'text-blue-600' : 'text-gray-400'}`} />
              <p className="text-sm font-medium text-gray-900">{m.label}</p>
              <p className="text-xs text-gray-500">{m.eta}</p>
            </button>
          )
        })}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep(1)} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <Button onClick={() => setStep(3)} disabled={!sendAmount} className="gap-2">
          Continue <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

function StepPayment() {
  const { paymentMethod, setPaymentMethod, setStep, sendAmount } = useSendFlowStore()

  const handleSelect = (value: string) => {
    setPaymentMethod(value)
    const selected = paymentMethods.find(p => p.value === value)
    if (selected) {
      useSendFlowStore.getState().setAmounts({
        ...useSendFlowStore.getState(),
        fee: selected.fee,
        totalCost: sendAmount + selected.fee,
      })
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-900 mb-1">How would you like to pay?</h2>
      <p className="text-sm text-gray-500 mb-6">Choose your preferred payment method</p>

      <div className="space-y-3 mb-8">
        {paymentMethods.map((m) => {
          const Icon = m.icon
          const selected = paymentMethod === m.value
          return (
            <button
              key={m.value}
              onClick={() => handleSelect(m.value)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${selected ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <Icon className={`w-5 h-5 ${selected ? 'text-blue-600' : 'text-gray-500'}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{m.label}</p>
                <p className="text-xs text-gray-500">{m.desc}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">
                  {m.fee === 0 ? 'Free' : formatCurrency(m.fee, 'USD')}
                </p>
                <p className="text-xs text-gray-500">fee</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
              }`}>
                {selected && <Check className="w-3 h-3 text-white" />}
              </div>
            </button>
          )
        })}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep(2)} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <Button onClick={() => setStep(4)} className="gap-2">
          Continue <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

function StepReview() {
  const {
    recipient, sendAmount, sendCurrency, receiveAmount, receiveCurrency,
    exchangeRate, deliveryMethod, paymentMethod, fee, totalCost,
    promoCode, setPromoCode, setStep,
  } = useSendFlowStore()

  const handleConfirm = () => {
    setStep(5)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-900 mb-1">Review your transfer</h2>
      <p className="text-sm text-gray-500 mb-6">Please confirm all details before sending</p>

      <Card className="mb-4">
        <CardContent className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Recipient</span>
            <span className="text-sm font-medium text-gray-900">{recipient?.firstName} {recipient?.lastName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Delivery Method</span>
            <span className="text-sm font-medium text-gray-900">{DELIVERY_METHOD_LABELS[deliveryMethod]}</span>
          </div>
          <hr className="border-gray-100" />
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">You send</span>
            <span className="text-sm font-medium text-gray-900">{formatCurrency(sendAmount, sendCurrency)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Exchange rate</span>
            <span className="text-sm font-medium text-green-600">1 {sendCurrency} = {exchangeRate.toFixed(4)} {receiveCurrency}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Transfer fee</span>
            <span className="text-sm font-medium text-gray-900">{fee === 0 ? 'Free' : formatCurrency(fee, sendCurrency)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Payment method</span>
            <span className="text-sm font-medium text-gray-900">{PAYMENT_METHOD_LABELS[paymentMethod]}</span>
          </div>
          <hr className="border-gray-100" />
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-900">Total cost</span>
            <span className="text-lg font-bold text-gray-900">{formatCurrency(totalCost, sendCurrency)}</span>
          </div>
          <div className="flex justify-between items-center bg-green-50 -mx-6 px-6 py-3">
            <span className="text-sm font-semibold text-green-800">They receive</span>
            <span className="text-lg font-bold text-green-700">{formatCurrency(receiveAmount, receiveCurrency)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Promo code */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-gray-400" />
            <Input
              placeholder="Enter promo code"
              value={promoCode || ''}
              onChange={(e) => setPromoCode(e.target.value || null)}
              className="flex-1"
            />
            <Button variant="outline" size="sm" disabled={!promoCode}>
              Apply
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep(3)} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <Button onClick={handleConfirm} size="lg" className="gap-2 px-8">
          Confirm & Send <CheckCircle2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

function StepSuccess() {
  const { recipient, sendAmount, sendCurrency, receiveAmount, receiveCurrency, reset } = useSendFlowStore()
  const referenceNumber = 'TXN-1SR-7K8M2P4Q9'

  return (
    <div className="max-w-lg mx-auto text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle2 className="w-8 h-8 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Transfer Submitted!</h2>
      <p className="text-gray-500 mb-6">
        Your transfer of {formatCurrency(sendAmount, sendCurrency)} to {recipient?.firstName} {recipient?.lastName} is being processed.
      </p>

      <Card className="mb-6 text-left">
        <CardContent className="p-6 space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Reference Number</span>
            <div className="flex items-center gap-1">
              <span className="text-sm font-mono font-medium text-gray-900">{referenceNumber}</span>
              <button className="p-1 hover:bg-gray-100 rounded">
                <Copy className="w-3.5 h-3.5 text-gray-400" />
              </button>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Amount Sent</span>
            <span className="text-sm font-medium">{formatCurrency(sendAmount, sendCurrency)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Amount Received</span>
            <span className="text-sm font-medium text-green-600">{formatCurrency(receiveAmount, receiveCurrency)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Estimated Delivery</span>
            <span className="text-sm font-medium">1-2 business days</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3">
        <Link href="/transactions/txn-001">
          <Button className="w-full">Track Transfer</Button>
        </Link>
        <Button variant="outline" className="w-full" onClick={() => reset()}>
          Send Another Transfer
        </Button>
      </div>

      {/* Referral prompt */}
      <Card className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
        <CardContent className="p-6">
          <p className="font-semibold text-gray-900 mb-1">Know someone who sends money abroad?</p>
          <p className="text-sm text-gray-600 mb-3">Share your link and you both earn $10!</p>
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="w-4 h-4" /> Share Referral Link
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default function SendMoneyPage() {
  const { step, reset } = useSendFlowStore()

  useEffect(() => {
    return () => {
      // Reset on unmount if not completed
      if (useSendFlowStore.getState().step < 5) {
        // Don't reset - keep state for back navigation
      }
    }
  }, [])

  return (
    <div className="max-w-4xl mx-auto">
      <Stepper currentStep={step} />
      {step === 1 && <StepRecipient />}
      {step === 2 && <StepAmount />}
      {step === 3 && <StepPayment />}
      {step === 4 && <StepReview />}
      {step === 5 && <StepSuccess />}
    </div>
  )
}
