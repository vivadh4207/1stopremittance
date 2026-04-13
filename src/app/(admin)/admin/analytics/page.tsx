'use client'

import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatCurrency } from '@/lib/utils'
import { Calendar, Download } from 'lucide-react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

const corridorRevenue = [
  { corridor: 'USA-IND', transfers: 4521, volume: 2345678, fxRevenue: 35198, feeRevenue: 23444, total: 58642, margin: 2.5 },
  { corridor: 'USA-PHL', transfers: 3214, volume: 1876543, fxRevenue: 28148, feeRevenue: 18766, total: 46914, margin: 2.5 },
  { corridor: 'USA-MEX', transfers: 2876, volume: 1234567, fxRevenue: 12346, feeRevenue: 12345, total: 24691, margin: 2.0 },
  { corridor: 'UK-NGA', transfers: 1543, volume: 987654, fxRevenue: 19753, feeRevenue: 9877, total: 29630, margin: 3.0 },
  { corridor: 'CAN-IND', transfers: 1298, volume: 876543, fxRevenue: 13148, feeRevenue: 8766, total: 21914, margin: 2.5 },
  { corridor: 'UK-PAK', transfers: 987, volume: 654321, fxRevenue: 13086, feeRevenue: 6544, total: 19630, margin: 3.0 },
  { corridor: 'USA-NGN', transfers: 876, volume: 543210, fxRevenue: 10864, feeRevenue: 5432, total: 16296, margin: 3.0 },
  { corridor: 'AUS-IND', transfers: 654, volume: 432109, fxRevenue: 6482, feeRevenue: 4321, total: 10803, margin: 2.5 },
]

const paymentMethodData = [
  { name: 'Bank Transfer', value: 45, amount: 105555 },
  { name: 'Debit Card', value: 30, amount: 70370 },
  { name: 'Credit Card', value: 15, amount: 35185 },
  { name: 'Digital Wallet', value: 10, amount: 23457 },
]

const deliveryMethodData = [
  { name: 'Bank Deposit', value: 55, amount: 129012 },
  { name: 'Mobile Wallet', value: 25, amount: 58642 },
  { name: 'Cash Pickup', value: 15, amount: 35185 },
  { name: 'Home Delivery', value: 5, amount: 11728 },
]

const COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#818cf8', '#7c3aed']
const PIE_COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd']

const dailyData = Array.from({ length: 30 }, (_, i) => {
  const date = new Date()
  date.setDate(date.getDate() - 29 + i)
  return {
    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    revenue: 6000 + Math.random() * 8000 + (i * 100),
    transfers: 350 + Math.floor(Math.random() * 200) + (i * 5),
  }
})

export default function AnalyticsPage() {
  const [startDate, setStartDate] = useState('2026-03-14')
  const [endDate, setEndDate] = useState('2026-04-13')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
          <p className="text-sm text-gray-500 mt-1">Detailed revenue and performance metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-9 w-40 text-sm"
            />
            <span className="text-gray-400">to</span>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-9 w-40 text-sm"
            />
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Daily Transfers & Revenue */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Transfers & Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="txGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} tickLine={false} />
                <Tooltip />
                <Legend />
                <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fill="url(#revGrad)" name="Revenue ($)" />
                <Area yAxisId="right" type="monotone" dataKey="transfers" stroke="#8b5cf6" strokeWidth={2} fill="url(#txGrad)" name="Transfers" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Corridor */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Corridor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={corridorRevenue} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="corridor" tick={{ fontSize: 11 }} tickLine={false} />
                  <YAxis tick={{ fontSize: 12 }} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value) => [formatCurrency(Number(value), 'USD'), 'Revenue']} />
                  <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                    {corridorRevenue.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Revenue by Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 flex items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentMethodData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                    label={(props) => `${props.name ?? ''} ${(((props.percent as number) ?? 0) * 100).toFixed(0)}%`}
                  >
                    {paymentMethodData.map((_, index) => (
                      <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Revenue by Delivery Method */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Delivery Method</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 flex items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deliveryMethodData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                    label={(props) => `${props.name ?? ''} ${(((props.percent as number) ?? 0) * 100).toFixed(0)}%`}
                  >
                    {deliveryMethodData.map((_, index) => (
                      <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Metrics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Corridor Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Corridor</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-500">Transfers</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-500">Volume</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-500">FX Revenue</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-500">Fee Revenue</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-500">Total Revenue</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-500">Avg Margin</th>
                </tr>
              </thead>
              <tbody>
                {corridorRevenue.map((row) => (
                  <tr key={row.corridor} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-2 font-medium text-gray-900">{row.corridor}</td>
                    <td className="py-3 px-2 text-right text-gray-600">{row.transfers.toLocaleString()}</td>
                    <td className="py-3 px-2 text-right text-gray-600">{formatCurrency(row.volume, 'USD')}</td>
                    <td className="py-3 px-2 text-right text-gray-600">{formatCurrency(row.fxRevenue, 'USD')}</td>
                    <td className="py-3 px-2 text-right text-gray-600">{formatCurrency(row.feeRevenue, 'USD')}</td>
                    <td className="py-3 px-2 text-right font-medium text-gray-900">{formatCurrency(row.total, 'USD')}</td>
                    <td className="py-3 px-2 text-right text-gray-600">{row.margin}%</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-200 font-semibold">
                  <td className="py-3 px-2 text-gray-900">Total</td>
                  <td className="py-3 px-2 text-right text-gray-900">
                    {corridorRevenue.reduce((s, r) => s + r.transfers, 0).toLocaleString()}
                  </td>
                  <td className="py-3 px-2 text-right text-gray-900">
                    {formatCurrency(corridorRevenue.reduce((s, r) => s + r.volume, 0), 'USD')}
                  </td>
                  <td className="py-3 px-2 text-right text-gray-900">
                    {formatCurrency(corridorRevenue.reduce((s, r) => s + r.fxRevenue, 0), 'USD')}
                  </td>
                  <td className="py-3 px-2 text-right text-gray-900">
                    {formatCurrency(corridorRevenue.reduce((s, r) => s + r.feeRevenue, 0), 'USD')}
                  </td>
                  <td className="py-3 px-2 text-right text-gray-900">
                    {formatCurrency(corridorRevenue.reduce((s, r) => s + r.total, 0), 'USD')}
                  </td>
                  <td className="py-3 px-2 text-right text-gray-900">
                    {(corridorRevenue.reduce((s, r) => s + r.margin, 0) / corridorRevenue.length).toFixed(1)}%
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
