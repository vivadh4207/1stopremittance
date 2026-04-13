'use client'

import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { formatCurrency } from '@/lib/utils'
import { Plus, Pencil, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  { id: 'fees', label: 'Fee Tiers' },
  { id: 'fx', label: 'FX Markup' },
  { id: 'promotions', label: 'Promotions' },
]

const feeTiers = [
  { id: '1', corridor: 'USA -> India', paymentMethod: 'Bank Transfer', deliveryMethod: 'Bank Deposit', minAmount: 0, maxAmount: 200, feeType: 'Flat', feeValue: 3.99 },
  { id: '2', corridor: 'USA -> India', paymentMethod: 'Bank Transfer', deliveryMethod: 'Bank Deposit', minAmount: 200, maxAmount: 500, feeType: 'Flat', feeValue: 4.99 },
  { id: '3', corridor: 'USA -> India', paymentMethod: 'Bank Transfer', deliveryMethod: 'Bank Deposit', minAmount: 500, maxAmount: 2000, feeType: 'Flat', feeValue: 6.99 },
  { id: '4', corridor: 'USA -> India', paymentMethod: 'Bank Transfer', deliveryMethod: 'Bank Deposit', minAmount: 2000, maxAmount: 10000, feeType: 'Percentage', feeValue: 0.35 },
  { id: '5', corridor: 'USA -> India', paymentMethod: 'Debit Card', deliveryMethod: 'Bank Deposit', minAmount: 0, maxAmount: 500, feeType: 'Flat', feeValue: 5.99 },
  { id: '6', corridor: 'USA -> India', paymentMethod: 'Debit Card', deliveryMethod: 'Bank Deposit', minAmount: 500, maxAmount: 5000, feeType: 'Percentage', feeValue: 0.50 },
  { id: '7', corridor: 'USA -> India', paymentMethod: 'Credit Card', deliveryMethod: 'Bank Deposit', minAmount: 0, maxAmount: 5000, feeType: 'Percentage', feeValue: 2.50 },
  { id: '8', corridor: 'USA -> Philippines', paymentMethod: 'Bank Transfer', deliveryMethod: 'Mobile Wallet', minAmount: 0, maxAmount: 200, feeType: 'Flat', feeValue: 2.99 },
  { id: '9', corridor: 'USA -> Philippines', paymentMethod: 'Bank Transfer', deliveryMethod: 'Mobile Wallet', minAmount: 200, maxAmount: 1000, feeType: 'Flat', feeValue: 4.99 },
  { id: '10', corridor: 'USA -> Philippines', paymentMethod: 'Bank Transfer', deliveryMethod: 'Cash Pickup', minAmount: 0, maxAmount: 1000, feeType: 'Flat', feeValue: 5.99 },
  { id: '11', corridor: 'USA -> Mexico', paymentMethod: 'Bank Transfer', deliveryMethod: 'Bank Deposit', minAmount: 0, maxAmount: 500, feeType: 'Flat', feeValue: 2.99 },
  { id: '12', corridor: 'USA -> Mexico', paymentMethod: 'Debit Card', deliveryMethod: 'Cash Pickup', minAmount: 0, maxAmount: 5000, feeType: 'Flat', feeValue: 4.99 },
  { id: '13', corridor: 'UK -> Nigeria', paymentMethod: 'Bank Transfer', deliveryMethod: 'Bank Deposit', minAmount: 0, maxAmount: 500, feeType: 'Flat', feeValue: 3.49 },
  { id: '14', corridor: 'UK -> Nigeria', paymentMethod: 'Bank Transfer', deliveryMethod: 'Mobile Wallet', minAmount: 0, maxAmount: 2000, feeType: 'Flat', feeValue: 4.49 },
]

const fxMarkups = [
  { corridor: 'USA -> India', currency: 'USD/INR', markup: 1.50, midRate: 83.45, ourRate: 82.20 },
  { corridor: 'USA -> Philippines', currency: 'USD/PHP', markup: 1.50, midRate: 56.12, ourRate: 55.28 },
  { corridor: 'USA -> Mexico', currency: 'USD/MXN', markup: 1.00, midRate: 17.25, ourRate: 17.08 },
  { corridor: 'UK -> Nigeria', currency: 'GBP/NGN', markup: 2.00, midRate: 1842.50, ourRate: 1805.65 },
  { corridor: 'Canada -> India', currency: 'CAD/INR', markup: 1.50, midRate: 61.30, ourRate: 60.38 },
  { corridor: 'UK -> Pakistan', currency: 'GBP/PKR', markup: 2.00, midRate: 356.80, ourRate: 349.66 },
  { corridor: 'USA -> Nigeria', currency: 'USD/NGN', markup: 2.00, midRate: 1478.00, ourRate: 1448.44 },
  { corridor: 'Australia -> India', currency: 'AUD/INR', markup: 1.50, midRate: 54.20, ourRate: 53.39 },
]

const promotions = [
  { id: '1', name: 'New User Welcome', type: 'Fee Waiver', value: '100%', usage: '1,234 / 5,000', status: 'active', startDate: '2026-03-01', endDate: '2026-04-30' },
  { id: '2', name: 'Spring Transfer Fest', type: 'Discount', value: '50% off fees', usage: '856 / 2,000', status: 'active', startDate: '2026-04-01', endDate: '2026-04-15' },
  { id: '3', name: 'Refer a Friend', type: 'Credit', value: '$10 credit', usage: '3,456 / unlimited', status: 'active', startDate: '2026-01-01', endDate: '2026-12-31' },
  { id: '4', name: 'India Corridor Special', type: 'Rate Boost', value: '+0.5% rate', usage: '432 / 1,000', status: 'active', startDate: '2026-04-01', endDate: '2026-04-30' },
  { id: '5', name: 'Holiday Bonus', type: 'Fee Waiver', value: '100%', usage: '2,000 / 2,000', status: 'expired', startDate: '2025-12-20', endDate: '2025-12-31' },
  { id: '6', name: 'Beta Tester Reward', type: 'Credit', value: '$25 credit', usage: '150 / 200', status: 'expired', startDate: '2025-09-01', endDate: '2025-11-30' },
  { id: '7', name: 'Summer Send-Off', type: 'Discount', value: '25% off fees', usage: '0 / 3,000', status: 'scheduled', startDate: '2026-06-01', endDate: '2026-08-31' },
]

const promoStatusVariant: Record<string, 'success' | 'secondary' | 'default'> = {
  active: 'success',
  expired: 'secondary',
  scheduled: 'default',
}

export default function PricingPage() {
  const [activeTab, setActiveTab] = useState('fees')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pricing Management</h2>
          <p className="text-sm text-gray-500 mt-1">Configure fees, FX markups, and promotions</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px',
              activeTab === tab.id
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Fee Tiers Tab */}
      {activeTab === 'fees' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Fee Tiers</CardTitle>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Fee Tier
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 font-medium text-gray-500">Corridor</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-500">Payment</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-500">Delivery</th>
                    <th className="text-right py-3 px-2 font-medium text-gray-500">Amount Range</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-500">Fee Type</th>
                    <th className="text-right py-3 px-2 font-medium text-gray-500">Fee Value</th>
                    <th className="text-center py-3 px-2 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {feeTiers.map((tier) => (
                    <tr key={tier.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 px-2 font-medium text-gray-900">{tier.corridor}</td>
                      <td className="py-3 px-2 text-gray-600">{tier.paymentMethod}</td>
                      <td className="py-3 px-2 text-gray-600">{tier.deliveryMethod}</td>
                      <td className="py-3 px-2 text-right text-gray-600">
                        ${tier.minAmount} - ${tier.maxAmount.toLocaleString()}
                      </td>
                      <td className="py-3 px-2">
                        <Badge variant={tier.feeType === 'Flat' ? 'default' : 'secondary'}>
                          {tier.feeType}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-right font-medium text-gray-900">
                        {tier.feeType === 'Flat' ? `$${tier.feeValue.toFixed(2)}` : `${tier.feeValue}%`}
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
      )}

      {/* FX Markup Tab */}
      {activeTab === 'fx' && (
        <Card>
          <CardHeader>
            <CardTitle>FX Markup by Corridor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 font-medium text-gray-500">Corridor</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-500">Currency Pair</th>
                    <th className="text-right py-3 px-2 font-medium text-gray-500">Mid-Market Rate</th>
                    <th className="text-right py-3 px-2 font-medium text-gray-500">Our Rate</th>
                    <th className="text-right py-3 px-2 font-medium text-gray-500">Markup %</th>
                    <th className="text-center py-3 px-2 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {fxMarkups.map((fx) => (
                    <tr key={fx.corridor} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 px-2 font-medium text-gray-900">{fx.corridor}</td>
                      <td className="py-3 px-2 text-gray-600">{fx.currency}</td>
                      <td className="py-3 px-2 text-right text-gray-600">{fx.midRate.toFixed(2)}</td>
                      <td className="py-3 px-2 text-right text-gray-600">{fx.ourRate.toFixed(2)}</td>
                      <td className="py-3 px-2 text-right">
                        <span className="inline-flex items-center gap-1 font-medium text-indigo-600">
                          {fx.markup.toFixed(2)}%
                        </span>
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
      )}

      {/* Promotions Tab */}
      {activeTab === 'promotions' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Campaigns</CardTitle>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Campaign
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 font-medium text-gray-500">Name</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-500">Type</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-500">Value</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-500">Usage</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-500">Status</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-500">Date Range</th>
                    <th className="text-center py-3 px-2 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {promotions.map((promo) => (
                    <tr key={promo.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 px-2 font-medium text-gray-900">{promo.name}</td>
                      <td className="py-3 px-2 text-gray-600">{promo.type}</td>
                      <td className="py-3 px-2 text-gray-600">{promo.value}</td>
                      <td className="py-3 px-2 text-gray-600">{promo.usage}</td>
                      <td className="py-3 px-2">
                        <Badge variant={promoStatusVariant[promo.status]}>{promo.status}</Badge>
                      </td>
                      <td className="py-3 px-2 text-gray-600 text-xs">
                        {promo.startDate} - {promo.endDate}
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
      )}
    </div>
  )
}
