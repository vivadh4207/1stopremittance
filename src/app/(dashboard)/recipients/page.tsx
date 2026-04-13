'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { DELIVERY_METHOD_LABELS } from '@/lib/constants'
import {
  Search,
  UserPlus,
  MoreVertical,
  SendHorizontal,
  Pencil,
  Trash2,
  Building2,
  Smartphone,
  Banknote,
} from 'lucide-react'

const deliveryIcons: Record<string, typeof Building2> = {
  BANK_DEPOSIT: Building2,
  MOBILE_WALLET: Smartphone,
  CASH_PICKUP: Banknote,
}

const recipients = [
  {
    id: 'r1',
    firstName: 'Ramesh',
    lastName: 'Sharma',
    country: 'Nepal',
    countryCode: 'NP',
    flag: '\u{1F1F3}\u{1F1F5}',
    currency: 'NPR',
    deliveryMethod: 'BANK_DEPOSIT',
    bankName: 'Nepal Bank Ltd',
    accountNumber: '****4521',
    lastUsed: '2026-04-11',
  },
  {
    id: 'r2',
    firstName: 'Priya',
    lastName: 'Patel',
    country: 'India',
    countryCode: 'IN',
    flag: '\u{1F1EE}\u{1F1F3}',
    currency: 'INR',
    deliveryMethod: 'BANK_DEPOSIT',
    bankName: 'State Bank of India',
    accountNumber: '****8832',
    lastUsed: '2026-04-10',
  },
  {
    id: 'r3',
    firstName: 'Maria',
    lastName: 'Santos',
    country: 'Philippines',
    countryCode: 'PH',
    flag: '\u{1F1F5}\u{1F1ED}',
    currency: 'PHP',
    deliveryMethod: 'MOBILE_WALLET',
    bankName: 'GCash',
    accountNumber: '+63 917 ***4567',
    lastUsed: '2026-04-10',
  },
  {
    id: 'r4',
    firstName: 'Ahmed',
    lastName: 'Khan',
    country: 'Pakistan',
    countryCode: 'PK',
    flag: '\u{1F1F5}\u{1F1F0}',
    currency: 'PKR',
    deliveryMethod: 'CASH_PICKUP',
    bankName: 'JazzCash',
    accountNumber: 'Pickup ID: JP-4521',
    lastUsed: '2026-04-08',
  },
  {
    id: 'r5',
    firstName: 'Fatima',
    lastName: 'Begum',
    country: 'Bangladesh',
    countryCode: 'BD',
    flag: '\u{1F1E7}\u{1F1E9}',
    currency: 'BDT',
    deliveryMethod: 'MOBILE_WALLET',
    bankName: 'bKash',
    accountNumber: '+880 ***5678',
    lastUsed: '2026-04-07',
  },
  {
    id: 'r6',
    firstName: 'Rajesh',
    lastName: 'Kumar',
    country: 'India',
    countryCode: 'IN',
    flag: '\u{1F1EE}\u{1F1F3}',
    currency: 'INR',
    deliveryMethod: 'BANK_DEPOSIT',
    bankName: 'HDFC Bank',
    accountNumber: '****2290',
    lastUsed: '2026-04-05',
  },
]

export default function RecipientsPage() {
  const [search, setSearch] = useState('')
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  const filtered = recipients.filter((r) => {
    if (!search) return true
    const fullName = `${r.firstName} ${r.lastName}`.toLowerCase()
    return fullName.includes(search.toLowerCase()) || r.country.toLowerCase().includes(search.toLowerCase())
  })

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recipients</h1>
          <p className="text-sm text-gray-500">{recipients.length} saved recipients</p>
        </div>
        <Button className="gap-2">
          <UserPlus className="w-4 h-4" /> Add Recipient
        </Button>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <Input
          placeholder="Search recipients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search className="w-4 h-4" />}
        />
      </div>

      {/* Recipients grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((r) => {
          const DeliveryIcon = deliveryIcons[r.deliveryMethod] || Building2
          return (
            <Card key={r.id} className="hover:shadow-md transition-shadow relative">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{r.flag}</span>
                    <div>
                      <p className="font-semibold text-gray-900">{r.firstName} {r.lastName}</p>
                      <p className="text-sm text-gray-500">{r.country}</p>
                    </div>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setOpenMenu(openMenu === r.id ? null : r.id)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                    {openMenu === r.id && (
                      <div className="absolute right-0 mt-1 w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          <Pencil className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <DeliveryIcon className="w-4 h-4 text-gray-400" />
                    <span>{DELIVERY_METHOD_LABELS[r.deliveryMethod]}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {r.bankName} &middot; {r.accountNumber}
                  </div>
                  <div className="text-xs text-gray-400">
                    Last used: {r.lastUsed}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline">{r.currency}</Badge>
                  <div className="flex-1" />
                  <Link href="/send">
                    <Button size="sm" variant="outline" className="gap-1.5">
                      <SendHorizontal className="w-3.5 h-3.5" /> Send
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-2">No recipients found</p>
          <p className="text-sm text-gray-400">Try a different search term</p>
        </div>
      )}
    </div>
  )
}
