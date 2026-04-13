'use client'

import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { formatCurrency } from '@/lib/utils'
import { Search, Download, ArrowLeftRight, AlertTriangle, Eye, Filter } from 'lucide-react'

const statusVariant: Record<string, 'success' | 'warning' | 'default' | 'destructive' | 'secondary'> = {
  completed: 'success',
  processing: 'default',
  pending: 'warning',
  failed: 'destructive',
  cancelled: 'secondary',
  flagged: 'destructive',
}

const transactions = [
  { ref: '1SRAB4K7NQ2', user: 'Rajesh Kumar', email: 'rajesh.kumar@gmail.com', sendAmount: 1500, sendCurrency: 'USD', receiveAmount: 123375, receiveCurrency: 'INR', corridor: 'USA -> India', status: 'completed', revenue: 22.50, compliance: [], date: '2026-04-13 14:32' },
  { ref: '1SRCD8M3PL5', user: 'Maria Santos', email: 'maria.santos@yahoo.com', sendAmount: 800, sendCurrency: 'USD', receiveAmount: 44256, receiveCurrency: 'PHP', corridor: 'USA -> Philippines', status: 'processing', revenue: 15.00, compliance: [], date: '2026-04-13 14:27' },
  { ref: '1SREF2N9QR7', user: 'Ahmed Hassan', email: 'ahmed.h@outlook.com', sendAmount: 2000, sendCurrency: 'GBP', receiveAmount: 3611300, receiveCurrency: 'NGN', corridor: 'UK -> Nigeria', status: 'completed', revenue: 45.00, compliance: ['high_amount'], date: '2026-04-13 14:15' },
  { ref: '1SRGH6P4ST1', user: 'Carlos Mendez', email: 'carlos.m@gmail.com', sendAmount: 500, sendCurrency: 'USD', receiveAmount: 8540, receiveCurrency: 'MXN', corridor: 'USA -> Mexico', status: 'pending', revenue: 8.50, compliance: [], date: '2026-04-13 14:08' },
  { ref: '1SRJK1R8UV3', user: 'Priya Deshmukh', email: 'priya.d@gmail.com', sendAmount: 3000, sendCurrency: 'CAD', receiveAmount: 181140, receiveCurrency: 'INR', corridor: 'Canada -> India', status: 'completed', revenue: 52.00, compliance: ['high_amount'], date: '2026-04-13 13:55' },
  { ref: '1SRLM5T2WX9', user: 'James Okonkwo', email: 'james.o@hotmail.com', sendAmount: 1200, sendCurrency: 'GBP', receiveAmount: 2166792, receiveCurrency: 'NGN', corridor: 'UK -> Nigeria', status: 'flagged', revenue: 28.00, compliance: ['sanctions_review', 'new_user'], date: '2026-04-13 13:42' },
  { ref: '1SRNP7V6YZ5', user: 'Li Wei Chen', email: 'liwei.chen@gmail.com', sendAmount: 600, sendCurrency: 'AUD', receiveAmount: 32034, receiveCurrency: 'INR', corridor: 'AUS -> India', status: 'completed', revenue: 12.00, compliance: [], date: '2026-04-13 13:30' },
  { ref: '1SRQR3X1AB8', user: 'David Park', email: 'david.park@gmail.com', sendAmount: 2500, sendCurrency: 'USD', receiveAmount: 205625, receiveCurrency: 'INR', corridor: 'USA -> India', status: 'completed', revenue: 37.50, compliance: ['high_amount'], date: '2026-04-13 13:18' },
  { ref: '1SRST9Z5CD2', user: 'Sophie Nguyen', email: 'sophie.n@outlook.com', sendAmount: 1800, sendCurrency: 'AUD', receiveAmount: 96102, receiveCurrency: 'INR', corridor: 'AUS -> India', status: 'completed', revenue: 36.00, compliance: [], date: '2026-04-13 13:05' },
  { ref: '1SRUV2B8EF6', user: 'Emmanuel Adeyemi', email: 'emmanuel.a@gmail.com', sendAmount: 500, sendCurrency: 'USD', receiveAmount: 724220, receiveCurrency: 'NGN', corridor: 'USA -> Nigeria', status: 'flagged', revenue: 10.00, compliance: ['velocity_check', 'new_user'], date: '2026-04-13 12:52' },
  { ref: '1SRWX4D1GH9', user: 'Meera Patel', email: 'meera.p@gmail.com', sendAmount: 4000, sendCurrency: 'CAD', receiveAmount: 241520, receiveCurrency: 'INR', corridor: 'Canada -> India', status: 'completed', revenue: 68.00, compliance: ['high_amount'], date: '2026-04-13 12:40' },
  { ref: '1SRYZ6F3JK4', user: 'John Williams', email: 'john.w@hotmail.com', sendAmount: 750, sendCurrency: 'GBP', receiveAmount: 267510, receiveCurrency: 'PKR', corridor: 'UK -> Pakistan', status: 'failed', revenue: 0, compliance: ['payment_failed'], date: '2026-04-13 12:28' },
  { ref: '1SRAB8H5LM7', user: 'Anika Sharma', email: 'anika.s@yahoo.com', sendAmount: 350, sendCurrency: 'GBP', receiveAmount: 124838, receiveCurrency: 'PKR', corridor: 'UK -> Pakistan', status: 'completed', revenue: 8.75, compliance: [], date: '2026-04-13 12:15' },
  { ref: '1SRCD1J7NP3', user: 'Roberto Garcia', email: 'roberto.g@gmail.com', sendAmount: 200, sendCurrency: 'USD', receiveAmount: 3416, receiveCurrency: 'MXN', corridor: 'USA -> Mexico', status: 'cancelled', revenue: 0, compliance: [], date: '2026-04-13 12:02' },
  { ref: '1SREF3K9QR8', user: 'Rajesh Kumar', email: 'rajesh.kumar@gmail.com', sendAmount: 5000, sendCurrency: 'USD', receiveAmount: 411250, receiveCurrency: 'INR', corridor: 'USA -> India', status: 'completed', revenue: 75.00, compliance: ['high_amount', 'repeat_large'], date: '2026-04-13 11:48' },
]

const complianceFlagLabels: Record<string, string> = {
  high_amount: 'High Amount',
  sanctions_review: 'Sanctions Review',
  new_user: 'New User',
  velocity_check: 'Velocity Check',
  payment_failed: 'Payment Failed',
  repeat_large: 'Repeat Large',
}

export default function TransactionsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [complianceFilter, setComplianceFilter] = useState('all')

  const filtered = transactions.filter((tx) => {
    const matchesSearch =
      tx.ref.toLowerCase().includes(search.toLowerCase()) ||
      tx.user.toLowerCase().includes(search.toLowerCase()) ||
      tx.email.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || tx.status === statusFilter
    const matchesCompliance =
      complianceFilter === 'all' ||
      (complianceFilter === 'flagged' && tx.compliance.length > 0) ||
      tx.compliance.includes(complianceFilter)
    return matchesSearch && matchesStatus && matchesCompliance
  })

  const flaggedCount = transactions.filter((t) => t.compliance.length > 0).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Transactions</h2>
          <p className="text-sm text-gray-500 mt-1">
            {transactions.length} total transactions
            {flaggedCount > 0 && (
              <span className="ml-2 text-amber-600">
                ({flaggedCount} with compliance flags)
              </span>
            )}
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <ArrowLeftRight className="h-5 w-5 text-indigo-600" />
              All Transactions
            </CardTitle>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search ref, user, email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-9"
                />
              </div>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: 'all', label: 'All Status' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'processing', label: 'Processing' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'flagged', label: 'Flagged' },
                  { value: 'failed', label: 'Failed' },
                  { value: 'cancelled', label: 'Cancelled' },
                ]}
                className="h-9 w-36"
              />
              <Select
                value={complianceFilter}
                onChange={(e) => setComplianceFilter(e.target.value)}
                options={[
                  { value: 'all', label: 'All Flags' },
                  { value: 'flagged', label: 'Has Flags' },
                  { value: 'high_amount', label: 'High Amount' },
                  { value: 'sanctions_review', label: 'Sanctions Review' },
                  { value: 'new_user', label: 'New User' },
                  { value: 'velocity_check', label: 'Velocity Check' },
                ]}
                className="h-9 w-40"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Reference</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500">User</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-500">Send</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Corridor</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Status</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-500">Revenue</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Compliance</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Date</th>
                  <th className="text-center py-3 px-2 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((tx) => (
                  <tr
                    key={tx.ref}
                    className={`border-b border-gray-50 hover:bg-gray-50 ${
                      tx.compliance.length > 0 && tx.status === 'flagged' ? 'bg-red-50/50' : ''
                    }`}
                  >
                    <td className="py-3 px-2">
                      <span className="font-mono text-xs text-indigo-600 font-medium">{tx.ref}</span>
                    </td>
                    <td className="py-3 px-2">
                      <div>
                        <p className="font-medium text-gray-900">{tx.user}</p>
                        <p className="text-xs text-gray-400">{tx.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <div>
                        <p className="font-medium text-gray-900">
                          {formatCurrency(tx.sendAmount, tx.sendCurrency)}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatCurrency(tx.receiveAmount, tx.receiveCurrency)}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-gray-600">{tx.corridor}</td>
                    <td className="py-3 px-2">
                      <Badge variant={statusVariant[tx.status]}>{tx.status}</Badge>
                    </td>
                    <td className="py-3 px-2 text-right">
                      {tx.revenue > 0 ? (
                        <span className="text-green-600 font-medium">
                          {formatCurrency(tx.revenue, 'USD')}
                        </span>
                      ) : (
                        <span className="text-gray-400">--</span>
                      )}
                    </td>
                    <td className="py-3 px-2">
                      {tx.compliance.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {tx.compliance.map((flag) => (
                            <span
                              key={flag}
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs bg-amber-50 text-amber-700 border border-amber-200"
                            >
                              <AlertTriangle className="h-2.5 w-2.5" />
                              {complianceFlagLabels[flag] || flag}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-300 text-xs">None</span>
                      )}
                    </td>
                    <td className="py-3 px-2 text-gray-600 text-xs whitespace-nowrap">{tx.date}</td>
                    <td className="py-3 px-2 text-center">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Showing {filtered.length} of {transactions.length} transactions
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
