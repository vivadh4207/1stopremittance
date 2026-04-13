'use client'

import React from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import {
  DollarSign,
  TrendingUp,
  ArrowLeftRight,
  Users,
  BarChart3,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const kpis = [
  {
    label: 'Total Revenue',
    value: 234567,
    change: 12.5,
    icon: DollarSign,
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  {
    label: "Today's Revenue",
    value: 12345,
    change: 8.2,
    icon: TrendingUp,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
  },
  {
    label: 'Total Transfers',
    value: 15234,
    change: 5.7,
    icon: ArrowLeftRight,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    isCurrency: false,
  },
  {
    label: 'Avg Revenue/Transfer',
    value: 15.4,
    change: -2.1,
    icon: BarChart3,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    label: 'Active Users',
    value: 8234,
    change: 15.3,
    icon: Users,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    isCurrency: false,
  },
  {
    label: 'Conversion Rate',
    value: 73,
    change: 3.1,
    icon: Target,
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    isPercent: true,
    isCurrency: false,
  },
]

const revenueData = Array.from({ length: 30 }, (_, i) => {
  const date = new Date()
  date.setDate(date.getDate() - 29 + i)
  return {
    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    revenue: 6000 + Math.random() * 8000 + (i * 100),
    transfers: 350 + Math.floor(Math.random() * 200) + (i * 5),
  }
})

const topCorridors = [
  { corridor: 'USA -> India', volume: 2345678, revenue: 58642, avgMargin: 2.5, transfers: 4521 },
  { corridor: 'USA -> Philippines', volume: 1876543, revenue: 46914, avgMargin: 2.5, transfers: 3214 },
  { corridor: 'USA -> Mexico', volume: 1234567, revenue: 24691, avgMargin: 2.0, transfers: 2876 },
  { corridor: 'UK -> Nigeria', volume: 987654, revenue: 29630, avgMargin: 3.0, transfers: 1543 },
  { corridor: 'Canada -> India', volume: 876543, revenue: 21914, avgMargin: 2.5, transfers: 1298 },
  { corridor: 'UK -> Pakistan', volume: 654321, revenue: 19630, avgMargin: 3.0, transfers: 987 },
]

const recentTransactions = [
  { ref: '1SRAB4K7NQ2', user: 'Rajesh K.', amount: 1500, currency: 'USD', corridor: 'USA -> India', status: 'completed', revenue: 22.50, date: '2 min ago' },
  { ref: '1SRCD8M3PL5', user: 'Maria S.', amount: 800, currency: 'USD', corridor: 'USA -> Philippines', status: 'processing', revenue: 15.00, date: '5 min ago' },
  { ref: '1SREF2N9QR7', user: 'Ahmed H.', amount: 2000, currency: 'GBP', corridor: 'UK -> Pakistan', status: 'completed', revenue: 45.00, date: '12 min ago' },
  { ref: '1SRGH6P4ST1', user: 'Carlos M.', amount: 500, currency: 'USD', corridor: 'USA -> Mexico', status: 'pending', revenue: 8.50, date: '18 min ago' },
  { ref: '1SRJK1R8UV3', user: 'Priya D.', amount: 3000, currency: 'CAD', corridor: 'Canada -> India', status: 'completed', revenue: 52.00, date: '25 min ago' },
  { ref: '1SRLM5T2WX9', user: 'James O.', amount: 1200, currency: 'GBP', corridor: 'UK -> Nigeria', status: 'flagged', revenue: 28.00, date: '31 min ago' },
]

const statusVariant: Record<string, 'success' | 'warning' | 'default' | 'destructive'> = {
  completed: 'success',
  processing: 'default',
  pending: 'warning',
  flagged: 'destructive',
}

export default function AdminOverviewPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
          <p className="text-sm text-gray-500 mt-1">Platform performance at a glance</p>
        </div>
        <Button variant="outline" size="sm">
          <BarChart3 className="h-4 w-4 mr-2" />
          Download Report
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${kpi.bg}`}>
                  <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                </div>
                <span
                  className={`flex items-center text-xs font-medium ${
                    kpi.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {kpi.change >= 0 ? (
                    <ArrowUpRight className="h-3 w-3 mr-0.5" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 mr-0.5" />
                  )}
                  {Math.abs(kpi.change)}%
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {kpi.isPercent
                  ? `${kpi.value}%`
                  : kpi.isCurrency === false
                  ? kpi.value.toLocaleString()
                  : formatCurrency(kpi.value, 'USD')}
              </p>
              <p className="text-xs text-gray-500 mt-1">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Revenue (Last 30 Days)</CardTitle>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                Revenue
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-purple-300" />
                Transfers
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(value: number, name: string) =>
                    name === 'revenue' ? [formatCurrency(value, 'USD'), 'Revenue'] : [value, 'Transfers']
                  }
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fill="url(#revenueGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Corridors */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Top Corridors</CardTitle>
              <Link href="/admin/corridors">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowUpRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2.5 font-medium text-gray-500">Corridor</th>
                    <th className="text-right py-2.5 font-medium text-gray-500">Volume</th>
                    <th className="text-right py-2.5 font-medium text-gray-500">Revenue</th>
                    <th className="text-right py-2.5 font-medium text-gray-500">Margin</th>
                  </tr>
                </thead>
                <tbody>
                  {topCorridors.map((c) => (
                    <tr key={c.corridor} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-2.5 font-medium text-gray-900">{c.corridor}</td>
                      <td className="py-2.5 text-right text-gray-600">{formatCurrency(c.volume, 'USD')}</td>
                      <td className="py-2.5 text-right text-gray-600">{formatCurrency(c.revenue, 'USD')}</td>
                      <td className="py-2.5 text-right text-gray-600">{c.avgMargin}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Transactions</CardTitle>
              <Link href="/admin/transactions">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowUpRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2.5 font-medium text-gray-500">Ref</th>
                    <th className="text-left py-2.5 font-medium text-gray-500">User</th>
                    <th className="text-right py-2.5 font-medium text-gray-500">Amount</th>
                    <th className="text-left py-2.5 font-medium text-gray-500">Status</th>
                    <th className="text-right py-2.5 font-medium text-gray-500">Rev</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((tx) => (
                    <tr key={tx.ref} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-2.5">
                        <button className="text-indigo-600 hover:underline font-mono text-xs">
                          {tx.ref.slice(0, 8)}...
                        </button>
                      </td>
                      <td className="py-2.5 text-gray-900">{tx.user}</td>
                      <td className="py-2.5 text-right text-gray-600">
                        {formatCurrency(tx.amount, tx.currency)}
                      </td>
                      <td className="py-2.5">
                        <Badge variant={statusVariant[tx.status]}>{tx.status}</Badge>
                      </td>
                      <td className="py-2.5 text-right text-green-600 font-medium">
                        {formatCurrency(tx.revenue, 'USD')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
