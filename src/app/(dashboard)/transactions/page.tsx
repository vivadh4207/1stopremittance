'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select } from '@/components/ui/select'
import { formatCurrency } from '@/lib/utils'
import { TRANSFER_STATUS_LABELS, DELIVERY_METHOD_LABELS } from '@/lib/constants'
import { Search, Filter, ArrowUpRight, Download } from 'lucide-react'

const statusBadgeVariant: Record<string, 'default' | 'success' | 'warning' | 'destructive' | 'secondary'> = {
  COMPLETED: 'success',
  DELIVERED: 'success',
  PROCESSING: 'default',
  IN_TRANSIT: 'default',
  PAYMENT_PENDING: 'warning',
  PAYMENT_RECEIVED: 'default',
  COMPLIANCE_REVIEW: 'warning',
  CANCELLED: 'destructive',
  FAILED: 'destructive',
  REFUNDED: 'secondary',
}

const transactions = [
  { id: 'txn-001', reference: '1SR7K8M2P4Q', recipient: 'Ramesh Sharma', flag: '\u{1F1F3}\u{1F1F5}', amountSent: 500, sendCurrency: 'USD', amountReceived: 66875, receiveCurrency: 'NPR', status: 'COMPLETED', date: '2026-04-11', deliveryMethod: 'BANK_DEPOSIT' },
  { id: 'txn-002', reference: '1SRA3B5C8D2', recipient: 'Priya Patel', flag: '\u{1F1EE}\u{1F1F3}', amountSent: 1000, sendCurrency: 'USD', amountReceived: 83450, receiveCurrency: 'INR', status: 'IN_TRANSIT', date: '2026-04-10', deliveryMethod: 'BANK_DEPOSIT' },
  { id: 'txn-003', reference: '1SRE6F9G3H7', recipient: 'Maria Santos', flag: '\u{1F1F5}\u{1F1ED}', amountSent: 300, sendCurrency: 'USD', amountReceived: 16890, receiveCurrency: 'PHP', status: 'PROCESSING', date: '2026-04-10', deliveryMethod: 'MOBILE_WALLET' },
  { id: 'txn-004', reference: '1SRJ2K5L8M4', recipient: 'Ahmed Khan', flag: '\u{1F1F5}\u{1F1F0}', amountSent: 200, sendCurrency: 'USD', amountReceived: 55780, receiveCurrency: 'PKR', status: 'COMPLETED', date: '2026-04-08', deliveryMethod: 'CASH_PICKUP' },
  { id: 'txn-005', reference: '1SRN9P3Q6R2', recipient: 'Fatima Begum', flag: '\u{1F1E7}\u{1F1E9}', amountSent: 150, sendCurrency: 'USD', amountReceived: 16470, receiveCurrency: 'BDT', status: 'PAYMENT_PENDING', date: '2026-04-07', deliveryMethod: 'MOBILE_WALLET' },
  { id: 'txn-006', reference: '1SRS5T8U2V6', recipient: 'Rajesh Kumar', flag: '\u{1F1EE}\u{1F1F3}', amountSent: 750, sendCurrency: 'USD', amountReceived: 62588, receiveCurrency: 'INR', status: 'COMPLETED', date: '2026-04-05', deliveryMethod: 'BANK_DEPOSIT' },
  { id: 'txn-007', reference: '1SRW3X6Y9Z5', recipient: 'Carlos Rodriguez', flag: '\u{1F1F2}\u{1F1FD}', amountSent: 400, sendCurrency: 'USD', amountReceived: 6900, receiveCurrency: 'MXN', status: 'CANCELLED', date: '2026-04-03', deliveryMethod: 'BANK_DEPOSIT' },
  { id: 'txn-008', reference: '1SRA8B2C5D9', recipient: 'Ramesh Sharma', flag: '\u{1F1F3}\u{1F1F5}', amountSent: 250, sendCurrency: 'USD', amountReceived: 33438, receiveCurrency: 'NPR', status: 'COMPLETED', date: '2026-03-28', deliveryMethod: 'BANK_DEPOSIT' },
  { id: 'txn-009', reference: '1SRE3F6G9H2', recipient: 'Li Wei', flag: '\u{1F1E8}\u{1F1F3}', amountSent: 2000, sendCurrency: 'USD', amountReceived: 14520, receiveCurrency: 'CNY', status: 'COMPLETED', date: '2026-03-25', deliveryMethod: 'BANK_DEPOSIT' },
  { id: 'txn-010', reference: '1SRJ6K9L2M5', recipient: 'Priya Patel', flag: '\u{1F1EE}\u{1F1F3}', amountSent: 500, sendCurrency: 'USD', amountReceived: 41725, receiveCurrency: 'INR', status: 'REFUNDED', date: '2026-03-20', deliveryMethod: 'BANK_DEPOSIT' },
]

const statusFilterOptions = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'IN_TRANSIT', label: 'In Transit' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'PAYMENT_PENDING', label: 'Awaiting Payment' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'REFUNDED', label: 'Refunded' },
]

export default function TransactionsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const filtered = transactions.filter((t) => {
    if (search && !t.recipient.toLowerCase().includes(search.toLowerCase()) && !t.reference.toLowerCase().includes(search.toLowerCase())) return false
    if (statusFilter !== 'ALL' && t.status !== statusFilter) return false
    if (dateFrom && t.date < dateFrom) return false
    if (dateTo && t.date > dateTo) return false
    return true
  })

  return (
    <div className="max-w-7xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-sm text-gray-500">View and manage your transfer history</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2 hidden sm:flex">
          <Download className="w-4 h-4" /> Export
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Search by recipient or reference..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                icon={<Search className="w-4 h-4" />}
              />
            </div>
            <Select
              options={statusFilterOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="sm:w-48"
            />
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="sm:w-40"
              placeholder="From"
            />
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="sm:w-40"
              placeholder="To"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table (desktop) */}
      <Card className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Date</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Reference</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Recipient</th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Sent</th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Received</th>
                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Status</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Method</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-600">{t.date}</td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-500">{t.reference}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span>{t.flag}</span>
                      <span className="text-sm font-medium text-gray-900">{t.recipient}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">{formatCurrency(t.amountSent, t.sendCurrency)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 text-right">{formatCurrency(t.amountReceived, t.receiveCurrency)}</td>
                  <td className="px-6 py-4 text-center">
                    <Badge variant={statusBadgeVariant[t.status] || 'secondary'}>
                      {TRANSFER_STATUS_LABELS[t.status]}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{DELIVERY_METHOD_LABELS[t.deliveryMethod]}</td>
                  <td className="px-6 py-4">
                    <Link href={`/transactions/${t.id}`}>
                      <Button variant="ghost" size="sm">
                        <ArrowUpRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-sm">No transactions found matching your filters.</p>
          </div>
        )}
      </Card>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filtered.map((t) => (
          <Link key={t.id} href={`/transactions/${t.id}`}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{t.flag}</span>
                    <span className="text-sm font-medium text-gray-900">{t.recipient}</span>
                  </div>
                  <Badge variant={statusBadgeVariant[t.status] || 'secondary'}>
                    {TRANSFER_STATUS_LABELS[t.status]}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{t.date}</span>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatCurrency(t.amountSent, t.sendCurrency)}</p>
                    <p className="text-xs text-gray-500">{formatCurrency(t.amountReceived, t.receiveCurrency)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
