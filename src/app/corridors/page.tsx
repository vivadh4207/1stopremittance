'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { getRate } from '@/lib/constants'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Search, ArrowRight, ArrowUpRight } from 'lucide-react'

const ALL_CORRIDORS = [
  { from: 'USD', to: 'NGN', label: 'USA to Nigeria', flag: '🇳🇬', slug: 'usd-to-ngn', popular: true },
  { from: 'USD', to: 'PHP', label: 'USA to Philippines', flag: '🇵🇭', slug: 'usd-to-php', popular: true },
  { from: 'USD', to: 'INR', label: 'USA to India', flag: '🇮🇳', slug: 'usd-to-inr', popular: false },
  { from: 'USD', to: 'GHS', label: 'USA to Ghana', flag: '🇬🇭', slug: 'usd-to-ghs', popular: false },
  { from: 'USD', to: 'MXN', label: 'USA to Mexico', flag: '🇲🇽', slug: 'usd-to-mxn', popular: false },
  { from: 'USD', to: 'KES', label: 'USA to Kenya', flag: '🇰🇪', slug: 'usd-to-kes', popular: false },
  { from: 'USD', to: 'PKR', label: 'USA to Pakistan', flag: '🇵🇰', slug: 'usd-to-pkr', popular: false },
  { from: 'USD', to: 'BDT', label: 'USA to Bangladesh', flag: '🇧🇩', slug: 'usd-to-bdt', popular: false },
]

export default function CorridorsPage() {
  const [search, setSearch] = useState('')

  const filtered = ALL_CORRIDORS.filter((c) =>
    c.label.toLowerCase().includes(search.toLowerCase()) ||
    c.to.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-950 pt-28 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block mb-4 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-medium text-emerald-400">
              All Routes
            </span>
            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              Money Transfer{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Corridors
              </span>
            </h1>
            <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
              Compare rates across all supported corridors. Find the cheapest way to send money home.
            </p>
          </div>

          <div className="max-w-md mx-auto mb-10">
            <div className="flex items-center gap-3 bg-gray-900/50 border border-white/10 rounded-xl px-4 py-3">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search corridors..."
                className="flex-1 bg-transparent text-white outline-none placeholder:text-gray-500"
              />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((corridor) => {
              const rate = getRate(corridor.from, corridor.to)
              return (
                <Link key={corridor.slug} href={`/corridors/${corridor.slug}`}>
                  <div className={cn(
                    'group relative bg-gray-900/50 border rounded-2xl p-6 transition-colors hover:border-emerald-400/30',
                    corridor.popular ? 'border-emerald-400/20' : 'border-white/10'
                  )}>
                    {corridor.popular && (
                      <span className="absolute -top-3 right-4 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 px-3 py-0.5 text-xs font-semibold text-gray-950">
                        Most Popular
                      </span>
                    )}
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{corridor.flag}</span>
                      <div className="flex-1">
                        <p className="text-sm text-gray-400">
                          {corridor.from} <ArrowRight className="inline h-3 w-3" /> {corridor.to}
                        </p>
                        <p className="text-lg font-bold text-white">{corridor.label}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-end justify-between">
                      <div>
                        <p className="text-xs text-gray-500">Mid-market rate</p>
                        <p className="text-xl font-bold text-emerald-400">
                          1 {corridor.from} = {rate.toFixed(2)} {corridor.to}
                        </p>
                      </div>
                      <span className="flex items-center gap-1 text-sm font-medium text-gray-400 group-hover:text-emerald-400 transition-colors">
                        Compare <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No corridors found matching your search.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
