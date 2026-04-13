'use client'

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import {
  Plus,
  ArrowLeftRight,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'

const walletBalances = [
  { currency: 'USD', currencyName: 'US Dollar', balance: 1245.50, flag: '\u{1F1FA}\u{1F1F8}', change: 2.3 },
  { currency: 'EUR', currencyName: 'Euro', balance: 320.00, flag: '\u{1F1EA}\u{1F1FA}', change: 0.8 },
  { currency: 'GBP', currencyName: 'British Pound', balance: 175.25, flag: '\u{1F1EC}\u{1F1E7}', change: -0.4 },
]

const totalUSD = 1245.50 + 320.00 * 1.09 + 175.25 * 1.27

const recentActivity = [
  { id: 1, type: 'deposit', description: 'Bank Transfer Deposit', amount: 500, currency: 'USD', date: '2026-04-11', status: 'COMPLETED' },
  { id: 2, type: 'send', description: 'Transfer to Ramesh Sharma', amount: -500, currency: 'USD', date: '2026-04-11', status: 'COMPLETED' },
  { id: 3, type: 'convert', description: 'USD to EUR Conversion', amount: -220, currency: 'USD', date: '2026-04-09', status: 'COMPLETED' },
  { id: 4, type: 'convert', description: 'USD to EUR Conversion', amount: 200, currency: 'EUR', date: '2026-04-09', status: 'COMPLETED' },
  { id: 5, type: 'deposit', description: 'Debit Card Deposit', amount: 1000, currency: 'USD', date: '2026-04-05', status: 'COMPLETED' },
  { id: 6, type: 'reward', description: 'Referral Bonus', amount: 10, currency: 'USD', date: '2026-04-03', status: 'COMPLETED' },
  { id: 7, type: 'send', description: 'Transfer to Priya Patel', amount: -750, currency: 'USD', date: '2026-04-01', status: 'COMPLETED' },
  { id: 8, type: 'deposit', description: 'Bank Transfer Deposit', amount: 2000, currency: 'USD', date: '2026-03-28', status: 'COMPLETED' },
]

const activityIcons: Record<string, { icon: typeof ArrowUpRight; color: string; bg: string }> = {
  deposit: { icon: ArrowDownLeft, color: 'text-green-600', bg: 'bg-green-100' },
  send: { icon: ArrowUpRight, color: 'text-red-600', bg: 'bg-red-100' },
  convert: { icon: ArrowLeftRight, color: 'text-blue-600', bg: 'bg-blue-100' },
  reward: { icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-100' },
}

export default function WalletPage() {
  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Wallet</h1>
          <p className="text-sm text-gray-500">Manage your multi-currency balances</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <ArrowLeftRight className="w-4 h-4" /> Convert
          </Button>
          <Button className="gap-2">
            <Plus className="w-4 h-4" /> Deposit
          </Button>
        </div>
      </div>

      {/* Total balance */}
      <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-5 h-5 text-blue-200" />
            <p className="text-sm text-blue-200">Total Balance (USD equivalent)</p>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(totalUSD, 'USD')}</p>
          <p className="text-sm text-blue-200 mt-1">Across {walletBalances.length} currencies</p>
        </CardContent>
      </Card>

      {/* Currency cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {walletBalances.map((w) => (
          <Card key={w.currency} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{w.flag}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{w.currency}</p>
                    <p className="text-xs text-gray-500">{w.currencyName}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${w.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {w.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {w.change >= 0 ? '+' : ''}{w.change}%
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(w.balance, w.currency)}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest wallet transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentActivity.map((activity) => {
              const config = activityIcons[activity.type] || activityIcons.deposit
              const Icon = config.icon
              const isPositive = activity.amount > 0
              return (
                <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg ${config.bg} flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 ${config.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500">{activity.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-gray-900'}`}>
                      {isPositive ? '+' : ''}{formatCurrency(Math.abs(activity.amount), activity.currency)}
                    </p>
                    <p className="text-xs text-gray-500">{activity.currency}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
