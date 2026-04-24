'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Clock, ArrowRight, BookOpen } from 'lucide-react'

const GUIDES = [
  {
    slug: 'best-ways-send-money-nigeria',
    title: 'Best Ways to Send Money to Nigeria in 2026',
    excerpt: 'Compare the top 8 services for sending money from the US to Nigeria. We break down fees, rates, speed, and delivery methods for each provider.',
    category: 'Nigeria',
    readTime: '8 min',
    flag: '🇳🇬',
  },
  {
    slug: 'cheapest-way-send-money-philippines',
    title: 'Cheapest Way to Send Money to the Philippines',
    excerpt: 'We compared fees and rates across all major providers to find the most affordable options for Filipino Americans sending money home.',
    category: 'Philippines',
    readTime: '6 min',
    flag: '🇵🇭',
  },
  {
    slug: 'nigerian-diaspora-remittance-guide',
    title: 'Nigerian Diaspora Remittance Guide: What You Need to Know',
    excerpt: 'Everything Nigerian Americans need to know about sending money home — from CBN regulations to the best banks for receiving transfers.',
    category: 'Nigeria',
    readTime: '10 min',
    flag: '🇳🇬',
  },
  {
    slug: 'filipino-balikbayan-remittance-tips',
    title: 'Balikbayan Guide: Best Remittance Options for Filipinos in the US',
    excerpt: 'A complete guide for Filipino Americans sending money home. Compare GCash, bank deposits, and cash pickup options.',
    category: 'Philippines',
    readTime: '7 min',
    flag: '🇵🇭',
  },
  {
    slug: 'avoid-hidden-fees-money-transfers',
    title: 'How to Avoid Hidden Fees on International Money Transfers',
    excerpt: 'Banks and some providers hide fees in exchange rate markups. Learn how to spot hidden costs and keep more money in your pocket.',
    category: 'Tips',
    readTime: '5 min',
    flag: '💡',
  },
  {
    slug: 'exchange-rate-timing-tips',
    title: 'When Is the Best Time to Send Money? Rate Timing Tips',
    excerpt: 'Exchange rates fluctuate throughout the day and week. Learn when to send for the best possible rate on your transfers.',
    category: 'Tips',
    readTime: '4 min',
    flag: '📊',
  },
]

const CATEGORIES = ['All', 'Nigeria', 'Philippines', 'Tips']

export default function GuidesPage() {
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = activeCategory === 'All'
    ? GUIDES
    : GUIDES.filter((g) => g.category === activeCategory)

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-950 pt-28 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block mb-4 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-medium text-emerald-400">
              Learn & Save
            </span>
            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              Remittance{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Guides & Resources
              </span>
            </h1>
            <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
              Everything you need to know about sending money home. Written by and for the diaspora community.
            </p>
          </div>

          {/* Category filter */}
          <div className="flex items-center justify-center gap-2 mb-10">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'px-5 py-2 rounded-full text-sm font-medium transition-all',
                  activeCategory === cat
                    ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Guide cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((guide) => (
              <Link key={guide.slug} href={`/guides/${guide.slug}`}>
                <div className="group bg-gray-900/50 border border-white/10 rounded-2xl p-6 h-full transition-colors hover:border-emerald-400/30">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{guide.flag}</span>
                    <span className={cn(
                      'px-3 py-1 rounded-full text-xs font-medium',
                      guide.category === 'Nigeria' ? 'bg-green-400/10 text-green-400' :
                      guide.category === 'Philippines' ? 'bg-blue-400/10 text-blue-400' :
                      'bg-yellow-400/10 text-yellow-400'
                    )}>
                      {guide.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                    {guide.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed mb-4">
                    {guide.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Clock className="h-3.5 w-3.5" /> {guide.readTime} read
                    </span>
                    <span className="flex items-center gap-1 text-sm font-medium text-gray-400 group-hover:text-emerald-400 transition-colors">
                      Read Guide <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
