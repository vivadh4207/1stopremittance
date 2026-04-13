'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { SEND_COUNTRIES, RECEIVE_COUNTRIES, getCountryByCurrency } from '@/lib/countries'
import { DELIVERY_METHOD_LABELS } from '@/lib/constants'
import { ArrowDownUp, Zap, Shield, Clock } from 'lucide-react'
import Link from 'next/link'

const MOCK_RATES: Record<string, number> = {
  'USD-INR': 83.25, 'USD-NPR': 133.50, 'USD-BDT': 110.50, 'USD-PKR': 278.50,
  'USD-PHP': 56.20, 'USD-MXN': 17.15, 'USD-BRL': 4.97, 'USD-GBP': 0.79,
  'GBP-INR': 105.50, 'GBP-NPR': 169.0, 'EUR-INR': 90.50,
  'CAD-INR': 61.20, 'AUD-INR': 54.40, 'AED-INR': 22.67, 'AED-NPR': 36.35,
  'SAR-INR': 22.20, 'USD-NGN': 1550.0, 'USD-KES': 153.50,
}

function getRate(from: string, to: string): number {
  return MOCK_RATES[`${from}-${to}`] || MOCK_RATES[`${to}-${from}`] ? 1 / MOCK_RATES[`${to}-${from}`]! : 0
}

function getFee(amount: number): number {
  if (amount <= 100) return 1.99
  if (amount <= 500) return 2.99
  if (amount <= 1000) return 3.99
  if (amount <= 5000) return 4.99
  return 5.99
}

export function RateCalculatorWidget() {
  const [sendCurrency, setSendCurrency] = useState('USD')
  const [receiveCurrency, setReceiveCurrency] = useState('INR')
  const [sendAmount, setSendAmount] = useState(1000)
  const [receiveAmount, setReceiveAmount] = useState(0)
  const [rate, setRate] = useState(0)
  const [fee, setFee] = useState(0)
  const [deliveryMethod, setDeliveryMethod] = useState('BANK_DEPOSIT')

  const calculate = useCallback(() => {
    const r = getRate(sendCurrency, receiveCurrency)
    const markup = r * 0.015 // 1.5% markup
    const customerRate = r - markup
    const f = getFee(sendAmount)
    setRate(customerRate)
    setFee(f)
    setReceiveAmount(Math.round(sendAmount * customerRate * 100) / 100)
  }, [sendCurrency, receiveCurrency, sendAmount])

  useEffect(() => {
    calculate()
  }, [calculate])

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-lg border border-gray-100">
      <div className="flex items-center gap-2 mb-6">
        <Zap className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">Send Money Abroad</h2>
      </div>

      {/* You Send */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">You send</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="number"
                value={sendAmount}
                onChange={(e) => setSendAmount(Number(e.target.value) || 0)}
                className="w-full h-14 px-4 text-2xl font-semibold border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                min={0}
              />
            </div>
            <select
              value={sendCurrency}
              onChange={(e) => setSendCurrency(e.target.value)}
              className="h-14 px-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-medium min-w-[120px]"
            >
              {SEND_COUNTRIES.map((c) => (
                <option key={c.id} value={c.currency}>
                  {c.flagEmoji} {c.currency}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Exchange Rate Display */}
        <div className="flex items-center justify-between bg-blue-50 rounded-xl px-4 py-3">
          <div className="flex items-center gap-2">
            <ArrowDownUp className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-blue-800">
              1 {sendCurrency} = <span className="font-bold">{rate.toFixed(4)}</span> {receiveCurrency}
            </span>
          </div>
          <span className="text-xs text-blue-600 font-medium">Live rate</span>
        </div>

        {/* Fee Display */}
        <div className="flex items-center justify-between px-4 py-2 text-sm">
          <span className="text-gray-500">Transfer fee</span>
          <span className="font-medium text-gray-700">
            {fee > 0 ? `${fee.toFixed(2)} ${sendCurrency}` : 'FREE'}
          </span>
        </div>

        <div className="flex items-center justify-between px-4 py-2 text-sm border-t border-gray-100">
          <span className="text-gray-500">Total to pay</span>
          <span className="font-semibold text-gray-900">
            {(sendAmount + fee).toFixed(2)} {sendCurrency}
          </span>
        </div>

        {/* Delivery Method */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Delivery method</label>
          <div className="grid grid-cols-2 gap-2">
            {(['BANK_DEPOSIT', 'MOBILE_WALLET', 'CASH_PICKUP', 'AIRTIME_TOPUP'] as const).map((method) => (
              <button
                key={method}
                onClick={() => setDeliveryMethod(method)}
                className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                  deliveryMethod === method
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                {DELIVERY_METHOD_LABELS[method]}
              </button>
            ))}
          </div>
        </div>

        {/* They Receive */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">They receive</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={receiveAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                readOnly
                className="w-full h-14 px-4 text-2xl font-semibold border border-gray-200 rounded-xl bg-green-50 text-green-700"
              />
            </div>
            <select
              value={receiveCurrency}
              onChange={(e) => setReceiveCurrency(e.target.value)}
              className="h-14 px-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-medium min-w-[120px]"
            >
              {RECEIVE_COUNTRIES.map((c) => (
                <option key={c.id} value={c.currency}>
                  {c.flagEmoji} {c.currency}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* CTA Button */}
        <Link href="/register">
          <Button size="xl" className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg mt-2">
            Send Money Now
          </Button>
        </Link>

        {/* Trust Indicators */}
        <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            <span>Bank-level security</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Arrives in minutes</span>
          </div>
        </div>
      </div>
    </div>
  )
}
