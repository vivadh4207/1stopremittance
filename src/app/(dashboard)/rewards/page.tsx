'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { formatCurrency } from '@/lib/utils'
import { POINTS_PER_100_USD, POINTS_TO_DOLLAR } from '@/lib/constants'
import {
  Gift,
  Star,
  Copy,
  Check,
  ArrowUpRight,
  Users,
  TrendingUp,
  Zap,
  CreditCard,
  Percent,
} from 'lucide-react'

const pointsBalance = 2450
const pointsValue = pointsBalance / POINTS_TO_DOLLAR
const referralLink = 'https://1stop.co/ref/JOHN2024'

const earningHistory = [
  { id: 1, description: 'Transfer to Ramesh Sharma', points: 50, date: '2026-04-11', type: 'transfer' },
  { id: 2, description: 'Transfer to Priya Patel', points: 100, date: '2026-04-10', type: 'transfer' },
  { id: 3, description: 'Referred Sarah Williams', points: 500, date: '2026-04-08', type: 'referral' },
  { id: 4, description: 'Transfer to Maria Santos', points: 30, date: '2026-04-07', type: 'transfer' },
  { id: 5, description: 'Bonus: 5 transfers this month', points: 200, date: '2026-04-05', type: 'bonus' },
  { id: 6, description: 'Transfer to Ahmed Khan', points: 20, date: '2026-04-03', type: 'transfer' },
  { id: 7, description: 'Referred Mike Chen', points: 500, date: '2026-03-28', type: 'referral' },
  { id: 8, description: 'Redeemed: Fee discount', points: -200, date: '2026-03-25', type: 'redemption' },
]

const redemptionOptions = [
  {
    id: 'fee-discount',
    title: 'Fee Discount',
    description: 'Apply points to reduce transfer fees',
    icon: Percent,
    pointsCost: 100,
    value: '$1.00 off fees',
    color: 'blue',
  },
  {
    id: 'rate-boost',
    title: 'Rate Boost',
    description: 'Get a better exchange rate on your next transfer',
    icon: TrendingUp,
    pointsCost: 250,
    value: '0.1% rate improvement',
    color: 'green',
  },
  {
    id: 'gift-card',
    title: 'Gift Card',
    description: 'Redeem for popular retail gift cards',
    icon: CreditCard,
    pointsCost: 500,
    value: '$5.00 gift card',
    color: 'purple',
  },
  {
    id: 'wallet-credit',
    title: 'Wallet Credit',
    description: 'Add funds directly to your wallet',
    icon: Zap,
    pointsCost: 1000,
    value: '$10.00 credit',
    color: 'amber',
  },
]

const colorMap: Record<string, { bg: string; text: string; iconBg: string }> = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-600', iconBg: 'bg-blue-100' },
  green: { bg: 'bg-green-50', text: 'text-green-600', iconBg: 'bg-green-100' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600', iconBg: 'bg-purple-100' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600', iconBg: 'bg-amber-100' },
}

const typeIcons: Record<string, { icon: typeof Star; color: string }> = {
  transfer: { icon: ArrowUpRight, color: 'text-blue-500' },
  referral: { icon: Users, color: 'text-green-500' },
  bonus: { icon: Star, color: 'text-amber-500' },
  redemption: { icon: Gift, color: 'text-red-500' },
}

export default function RewardsPage() {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Rewards</h1>
        <p className="text-sm text-gray-500">Earn and redeem points with every transfer</p>
      </div>

      {/* Points balance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2 bg-gradient-to-br from-amber-500 to-orange-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-amber-200" />
              <p className="text-sm text-amber-100">Available Points</p>
            </div>
            <p className="text-4xl font-bold mb-1">{pointsBalance.toLocaleString()}</p>
            <p className="text-sm text-amber-100">
              Worth approximately {formatCurrency(pointsValue, 'USD')}
            </p>
            <div className="mt-4 flex gap-3">
              <div className="bg-white/15 rounded-lg px-4 py-2">
                <p className="text-xs text-amber-100">Earn Rate</p>
                <p className="text-sm font-semibold">{POINTS_PER_100_USD} pts / $100</p>
              </div>
              <div className="bg-white/15 rounded-lg px-4 py-2">
                <p className="text-xs text-amber-100">Referral Bonus</p>
                <p className="text-sm font-semibold">500 pts each</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Referral card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-blue-600" />
              <p className="font-semibold text-gray-900">Refer Friends</p>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Earn 500 points + $10 for each friend who completes their first transfer
            </p>
            <div className="flex items-center gap-2">
              <Input
                value={referralLink}
                readOnly
                className="text-xs"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopy}
                className="shrink-0"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Redemption options */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Redeem Points</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {redemptionOptions.map((option) => {
            const colors = colorMap[option.color]
            const Icon = option.icon
            const canAfford = pointsBalance >= option.pointsCost
            return (
              <Card key={option.id} className={`hover:shadow-md transition-shadow ${!canAfford ? 'opacity-60' : ''}`}>
                <CardContent className="p-5">
                  <div className={`w-10 h-10 rounded-lg ${colors.iconBg} flex items-center justify-center mb-3`}>
                    <Icon className={`w-5 h-5 ${colors.text}`} />
                  </div>
                  <p className="font-semibold text-gray-900 text-sm mb-1">{option.title}</p>
                  <p className="text-xs text-gray-500 mb-3">{option.description}</p>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="text-xs">{option.value}</Badge>
                    <span className="text-xs font-semibold text-gray-900">{option.pointsCost} pts</span>
                  </div>
                  <Button
                    size="sm"
                    className="w-full"
                    variant={canAfford ? 'default' : 'secondary'}
                    disabled={!canAfford}
                  >
                    {canAfford ? 'Redeem' : 'Not enough points'}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Earning history */}
      <Card>
        <CardHeader>
          <CardTitle>Points History</CardTitle>
          <CardDescription>Your recent points activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {earningHistory.map((entry) => {
              const config = typeIcons[entry.type] || typeIcons.transfer
              const Icon = config.icon
              const isPositive = entry.points > 0
              return (
                <div key={entry.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${config.color}`} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{entry.description}</p>
                      <p className="text-xs text-gray-500">{entry.date}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositive ? '+' : ''}{entry.points} pts
                  </span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
