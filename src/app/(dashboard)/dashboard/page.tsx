'use client'

import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { TRANSFER_STATUS_LABELS, DELIVERY_METHOD_LABELS } from '@/lib/constants'
import {
  SendHorizontal,
  ArrowUpRight,
  ArrowDownLeft,
  Users,
  Clock,
  Gift,
  TrendingUp,
  Copy,
} from 'lucide-react'

const statusBadgeVariant: Record<string, 'default' | 'success' | 'warning' | 'destructive' | 'secondary'> = {
  COMPLETED: 'success',
  DELIVERED: 'success',
  PROCESSING: 'default',
  IN_TRANSIT: 'default',
  PAYMENT_PENDING: 'warning',
  CANCELLED: 'destructive',
  FAILED: 'destructive',
}

const recentTransactions = [
  {
    id: 'txn-001',
    recipient: 'Ramesh Sharma',
    country: 'Nepal',
    flag: '\u{1F1F3}\u{1F1F5}',
    amountSent: 500,
    sendCurrency: 'USD',
    amountReceived: 66875,
    receiveCurrency: 'NPR',
    status: 'COMPLETED',
    date: '2026-04-11',
    deliveryMethod: 'BANK_DEPOSIT',
  },
  {
    id: 'txn-002',
    recipient: 'Priya Patel',
    country: 'India',
    flag: '\u{1F1EE}\u{1F1F3}',
    amountSent: 1000,
    sendCurrency: 'USD',
    amountReceived: 83450,
    receiveCurrency: 'INR',
    status: 'IN_TRANSIT',
    date: '2026-04-10',
    deliveryMethod: 'BANK_DEPOSIT',
  },
  {
    id: 'txn-003',
    recipient: 'Maria Santos',
    country: 'Philippines',
    flag: '\u{1F1F5}\u{1F1ED}',
    amountSent: 300,
    sendCurrency: 'USD',
    amountReceived: 16890,
    receiveCurrency: 'PHP',
    status: 'PROCESSING',
    date: '2026-04-10',
    deliveryMethod: 'MOBILE_WALLET',
  },
  {
    id: 'txn-004',
    recipient: 'Ahmed Khan',
    country: 'Pakistan',
    flag: '\u{1F1F5}\u{1F1F0}',
    amountSent: 200,
    sendCurrency: 'USD',
    amountReceived: 55780,
    receiveCurrency: 'PKR',
    status: 'COMPLETED',
    date: '2026-04-08',
    deliveryMethod: 'CASH_PICKUP',
  },
  {
    id: 'txn-005',
    recipient: 'Fatima Begum',
    country: 'Bangladesh',
    flag: '\u{1F1E7}\u{1F1E9}',
    amountSent: 150,
    sendCurrency: 'USD',
    amountReceived: 16470,
    receiveCurrency: 'BDT',
    status: 'PAYMENT_PENDING',
    date: '2026-04-07',
    deliveryMethod: 'MOBILE_WALLET',
  },
]

const walletBalances = [
  { currency: 'USD', balance: 1245.50, change: '+2.3%' },
  { currency: 'EUR', balance: 320.00, change: '+0.8%' },
  { currency: 'GBP', balance: 175.25, change: '-0.4%' },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-7xl">
      {/* Quick actions row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Quick Send */}
        <Link href="/send">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-blue-100 bg-gradient-to-br from-blue-50 to-white group">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <SendHorizontal className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Send Money</p>
                <p className="text-sm text-gray-500">Fast international transfers</p>
              </div>
              <ArrowUpRight className="w-5 h-5 text-gray-400 ml-auto" />
            </CardContent>
          </Card>
        </Link>

        {/* Total Sent */}
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Sent This Month</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(2150, 'USD')}</p>
            </div>
          </CardContent>
        </Card>

        {/* Reward Points */}
        <Link href="/rewards">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <Gift className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Reward Points</p>
                <p className="text-xl font-bold text-gray-900">2,450 pts</p>
              </div>
              <ArrowUpRight className="w-5 h-5 text-gray-400 ml-auto" />
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your latest money transfers</CardDescription>
              </div>
              <Link href="/transactions">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTransactions.map((txn) => (
                  <Link
                    key={txn.id}
                    href={`/transactions/${txn.id}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{txn.flag}</span>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{txn.recipient}</p>
                        <p className="text-xs text-gray-500">{txn.date} &middot; {DELIVERY_METHOD_LABELS[txn.deliveryMethod]}</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          -{formatCurrency(txn.amountSent, txn.sendCurrency)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatCurrency(txn.amountReceived, txn.receiveCurrency)}
                        </p>
                      </div>
                      <Badge variant={statusBadgeVariant[txn.status] || 'secondary'}>
                        {TRANSFER_STATUS_LABELS[txn.status]}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Wallet Balances */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Wallet Balances</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {walletBalances.map((w) => (
                <div key={w.currency} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{w.currency}</p>
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(w.balance, w.currency)}</p>
                  </div>
                  <span className={`text-xs font-medium ${w.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {w.change}
                  </span>
                </div>
              ))}
              <Link href="/wallet">
                <Button variant="outline" className="w-full mt-2">Manage Wallet</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Referral Banner */}
          <Card className="bg-gradient-to-br from-indigo-600 to-blue-700 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="w-5 h-5" />
                <p className="font-semibold">Invite Friends</p>
              </div>
              <p className="text-sm text-blue-100 mb-4">
                Earn $10 for every friend who sends their first transfer
              </p>
              <div className="flex items-center gap-2 bg-white/10 rounded-lg p-2 text-sm">
                <span className="flex-1 truncate text-blue-100">1stop.co/ref/JOHN2024</span>
                <button className="p-1 hover:bg-white/10 rounded">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
