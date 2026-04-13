'use client'

import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { TRANSFER_STATUS_LABELS, DELIVERY_METHOD_LABELS, PAYMENT_METHOD_LABELS } from '@/lib/constants'
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock,
  Copy,
  Download,
  HelpCircle,
  Loader2,
} from 'lucide-react'

// Mock transaction detail
const transaction = {
  id: 'txn-001',
  reference: '1SR7K8M2P4Q',
  status: 'IN_TRANSIT',
  createdAt: '2026-04-10T14:30:00Z',
  updatedAt: '2026-04-11T09:15:00Z',
  sender: {
    name: 'John Doe',
    email: 'john.doe@email.com',
  },
  recipient: {
    name: 'Ramesh Sharma',
    country: 'Nepal',
    flag: '\u{1F1F3}\u{1F1F5}',
    deliveryMethod: 'BANK_DEPOSIT',
    bankName: 'Nepal Bank Ltd',
    accountNumber: '****4521',
  },
  sendAmount: 500,
  sendCurrency: 'USD',
  receiveAmount: 66875,
  receiveCurrency: 'NPR',
  exchangeRate: 133.75,
  fee: 1.99,
  totalCost: 501.99,
  paymentMethod: 'DEBIT_CARD',
  estimatedDelivery: '2026-04-12',
}

const timeline = [
  { status: 'INITIATED', label: 'Transfer Initiated', date: 'Apr 10, 2:30 PM', completed: true },
  { status: 'PAYMENT_RECEIVED', label: 'Payment Received', date: 'Apr 10, 2:32 PM', completed: true },
  { status: 'PROCESSING', label: 'Processing', date: 'Apr 10, 3:00 PM', completed: true },
  { status: 'SENT_TO_PARTNER', label: 'Sent to Partner', date: 'Apr 11, 9:15 AM', completed: true },
  { status: 'IN_TRANSIT', label: 'In Transit', date: 'Apr 11, 9:15 AM', completed: true, current: true },
  { status: 'DELIVERED', label: 'Delivered to Bank', date: '', completed: false },
  { status: 'COMPLETED', label: 'Completed', date: '', completed: false },
]

export default function TransactionDetailPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/transactions">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Transfer Details</h1>
            <Badge variant="default">{TRANSFER_STATUS_LABELS[transaction.status]}</Badge>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-gray-500 font-mono">{transaction.reference}</p>
            <button className="p-0.5 hover:bg-gray-100 rounded">
              <Copy className="w-3.5 h-3.5 text-gray-400" />
            </button>
          </div>
        </div>
        <Button variant="outline" size="sm" className="gap-2 hidden sm:flex">
          <Download className="w-4 h-4" /> Receipt
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Amount summary */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">You sent</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(transaction.sendAmount, transaction.sendCurrency)}</p>
                </div>
                <div className="text-center px-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-1">
                    <span className="text-blue-600 font-bold text-xs">FX</span>
                  </div>
                  <p className="text-xs text-gray-500">{transaction.exchangeRate}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-1">They receive</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(transaction.receiveAmount, transaction.receiveCurrency)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-500 mb-0.5">Transfer Fee</p>
                  <p className="font-medium">{formatCurrency(transaction.fee, transaction.sendCurrency)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-500 mb-0.5">Total Cost</p>
                  <p className="font-medium">{formatCurrency(transaction.totalCost, transaction.sendCurrency)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-500 mb-0.5">Payment Method</p>
                  <p className="font-medium">{PAYMENT_METHOD_LABELS[transaction.paymentMethod]}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-500 mb-0.5">Est. Delivery</p>
                  <p className="font-medium">{transaction.estimatedDelivery}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recipient info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recipient Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Name</span>
                  <div className="flex items-center gap-2">
                    <span>{transaction.recipient.flag}</span>
                    <span className="text-sm font-medium">{transaction.recipient.name}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Country</span>
                  <span className="text-sm font-medium">{transaction.recipient.country}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Delivery Method</span>
                  <span className="text-sm font-medium">{DELIVERY_METHOD_LABELS[transaction.recipient.deliveryMethod]}</span>
                </div>
                {transaction.recipient.bankName && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Bank</span>
                    <span className="text-sm font-medium">{transaction.recipient.bankName}</span>
                  </div>
                )}
                {transaction.recipient.accountNumber && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Account</span>
                    <span className="text-sm font-mono font-medium">{transaction.recipient.accountNumber}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Timeline */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Status Timeline</CardTitle>
              <CardDescription>Track your transfer progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                {timeline.map((step, i) => (
                  <div key={step.status} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      {step.completed ? (
                        step.current ? (
                          <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                            <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                          </div>
                        ) : (
                          <CheckCircle2 className="w-6 h-6 text-green-500" />
                        )
                      ) : (
                        <Circle className="w-6 h-6 text-gray-300" />
                      )}
                      {i < timeline.length - 1 && (
                        <div className={`w-0.5 h-8 my-1 ${step.completed ? 'bg-green-300' : 'bg-gray-200'}`} />
                      )}
                    </div>
                    <div className="pb-6">
                      <p className={`text-sm font-medium ${step.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                        {step.label}
                      </p>
                      {step.date && (
                        <p className="text-xs text-gray-500">{step.date}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardContent className="p-4 flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Need help?</p>
                <p className="text-xs text-gray-500">Contact support for this transfer</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
