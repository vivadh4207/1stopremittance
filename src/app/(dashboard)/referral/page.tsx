'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Copy, Gift, Users, DollarSign, Share2, CheckCircle } from 'lucide-react'

const mockReferrals = [
  { name: 'A****@gmail.com', status: 'Completed first transfer', earned: '$10.00', date: 'Mar 15, 2024' },
  { name: 'R****@yahoo.com', status: 'Signed up', earned: 'Pending', date: 'Mar 10, 2024' },
  { name: 'S****@outlook.com', status: 'Completed first transfer', earned: '$10.00', date: 'Feb 28, 2024' },
]

export default function ReferralPage() {
  const [copied, setCopied] = useState(false)
  const referralCode = '1SR-JOHND-X7K9'
  const referralLink = `https://1stopremittance.com/register?ref=${referralCode}`

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Refer & Earn</h1>
        <p className="text-gray-600 mt-1">Share 1StopRemittance and earn $10 for every friend who completes their first transfer.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">7</div>
            <div className="text-sm text-gray-500">Friends Invited</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">4</div>
            <div className="text-sm text-gray-500">Completed Transfers</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <DollarSign className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">$40.00</div>
            <div className="text-sm text-gray-500">Total Earned</div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Link */}
      <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0">
        <CardContent className="p-8">
          <div className="flex items-center gap-3 mb-4">
            <Gift className="w-8 h-8" />
            <div>
              <h2 className="text-xl font-bold">Your Referral Link</h2>
              <p className="text-blue-100 text-sm">Share this link with friends and family</p>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <div className="flex-1 bg-white/20 rounded-lg px-4 py-3 text-sm font-mono truncate">
              {referralLink}
            </div>
            <Button
              onClick={handleCopy}
              className="bg-white text-blue-700 hover:bg-gray-100 flex items-center gap-2"
            >
              {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
          <div className="mt-4 flex gap-2">
            <div className="text-sm bg-white/20 rounded-lg px-3 py-1">
              Code: <span className="font-bold">{referralCode}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How it works */}
      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Share2 className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">1. Share Your Link</h3>
              <p className="text-sm text-gray-600">Send your referral link to friends via email, text, or social media</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">2. Friend Signs Up</h3>
              <p className="text-sm text-gray-600">They create an account and get their first transfer fee-free</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">3. You Both Earn</h3>
              <p className="text-sm text-gray-600">You get $10 credit and they get their first transfer fee waived</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referral History */}
      <Card>
        <CardHeader>
          <CardTitle>Referral History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockReferrals.map((ref, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{ref.name}</p>
                  <p className="text-xs text-gray-500">{ref.date}</p>
                </div>
                <div className="text-right">
                  <Badge variant={ref.earned === 'Pending' ? 'warning' : 'success'}>
                    {ref.earned}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">{ref.status}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
