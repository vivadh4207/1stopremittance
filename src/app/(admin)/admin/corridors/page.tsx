'use client'

import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { formatCurrency } from '@/lib/utils'
import { Plus, Pencil, Search, Globe2, ArrowUpDown } from 'lucide-react'

interface Corridor {
  id: string
  from: string
  fromCode: string
  to: string
  toCode: string
  active: boolean
  fxMarkup: number
  minAmount: number
  maxAmount: number
  dailyVolume: number
  revenue: number
  transfers: number
}

const initialCorridors: Corridor[] = [
  { id: '1', from: 'United States', fromCode: 'USD', to: 'India', toCode: 'INR', active: true, fxMarkup: 1.5, minAmount: 50, maxAmount: 10000, dailyVolume: 234567, revenue: 58642, transfers: 4521 },
  { id: '2', from: 'United States', fromCode: 'USD', to: 'Philippines', toCode: 'PHP', active: true, fxMarkup: 1.5, minAmount: 50, maxAmount: 8000, dailyVolume: 187654, revenue: 46914, transfers: 3214 },
  { id: '3', from: 'United States', fromCode: 'USD', to: 'Mexico', toCode: 'MXN', active: true, fxMarkup: 1.0, minAmount: 25, maxAmount: 5000, dailyVolume: 123456, revenue: 24691, transfers: 2876 },
  { id: '4', from: 'United Kingdom', fromCode: 'GBP', to: 'Nigeria', toCode: 'NGN', active: true, fxMarkup: 2.0, minAmount: 30, maxAmount: 7000, dailyVolume: 98765, revenue: 29630, transfers: 1543 },
  { id: '5', from: 'Canada', fromCode: 'CAD', to: 'India', toCode: 'INR', active: true, fxMarkup: 1.5, minAmount: 50, maxAmount: 10000, dailyVolume: 87654, revenue: 21914, transfers: 1298 },
  { id: '6', from: 'United Kingdom', fromCode: 'GBP', to: 'Pakistan', toCode: 'PKR', active: true, fxMarkup: 2.0, minAmount: 30, maxAmount: 7000, dailyVolume: 65432, revenue: 19630, transfers: 987 },
  { id: '7', from: 'United States', fromCode: 'USD', to: 'Nigeria', toCode: 'NGN', active: true, fxMarkup: 2.0, minAmount: 50, maxAmount: 5000, dailyVolume: 54321, revenue: 16296, transfers: 876 },
  { id: '8', from: 'Australia', fromCode: 'AUD', to: 'India', toCode: 'INR', active: true, fxMarkup: 1.5, minAmount: 50, maxAmount: 10000, dailyVolume: 43210, revenue: 10803, transfers: 654 },
  { id: '9', from: 'United States', fromCode: 'USD', to: 'Vietnam', toCode: 'VND', active: false, fxMarkup: 1.8, minAmount: 50, maxAmount: 5000, dailyVolume: 0, revenue: 0, transfers: 0 },
  { id: '10', from: 'Canada', fromCode: 'CAD', to: 'Philippines', toCode: 'PHP', active: false, fxMarkup: 1.5, minAmount: 50, maxAmount: 8000, dailyVolume: 0, revenue: 0, transfers: 0 },
]

export default function CorridorsPage() {
  const [corridors, setCorridors] = useState(initialCorridors)
  const [search, setSearch] = useState('')

  const toggleActive = (id: string) => {
    setCorridors((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    )
  }

  const filtered = corridors.filter(
    (c) =>
      c.from.toLowerCase().includes(search.toLowerCase()) ||
      c.to.toLowerCase().includes(search.toLowerCase()) ||
      c.fromCode.toLowerCase().includes(search.toLowerCase()) ||
      c.toCode.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Corridor Management</h2>
          <p className="text-sm text-gray-500 mt-1">
            {corridors.filter((c) => c.active).length} active corridors of {corridors.length} total
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Corridor
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Globe2 className="h-5 w-5 text-indigo-600" />
              All Corridors
            </CardTitle>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search corridors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Corridor</th>
                  <th className="text-center py-3 px-2 font-medium text-gray-500">Status</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-500">
                    <span className="flex items-center justify-end gap-1">
                      FX Markup <ArrowUpDown className="h-3 w-3" />
                    </span>
                  </th>
                  <th className="text-right py-3 px-2 font-medium text-gray-500">Min</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-500">Max</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-500">Daily Volume</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-500">Revenue (30d)</th>
                  <th className="text-center py-3 px-2 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {c.fromCode}
                        </span>
                        <span className="text-gray-400">-&gt;</span>
                        <span className="font-medium text-gray-900">
                          {c.toCode}
                        </span>
                        <span className="text-xs text-gray-400 ml-1">
                          ({c.from} to {c.to})
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <button
                        onClick={() => toggleActive(c.id)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                          c.active ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform ${
                            c.active ? 'translate-x-4.5' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="py-3 px-2 text-right font-medium text-gray-900">{c.fxMarkup}%</td>
                    <td className="py-3 px-2 text-right text-gray-600">
                      {formatCurrency(c.minAmount, c.fromCode)}
                    </td>
                    <td className="py-3 px-2 text-right text-gray-600">
                      {formatCurrency(c.maxAmount, c.fromCode)}
                    </td>
                    <td className="py-3 px-2 text-right text-gray-600">
                      {c.dailyVolume > 0 ? formatCurrency(c.dailyVolume, c.fromCode) : '--'}
                    </td>
                    <td className="py-3 px-2 text-right text-gray-600">
                      {c.revenue > 0 ? formatCurrency(c.revenue, 'USD') : '--'}
                    </td>
                    <td className="py-3 px-2 text-center">
                      <Button variant="ghost" size="sm">
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
