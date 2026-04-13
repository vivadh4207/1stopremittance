'use client'

import { POPULAR_CORRIDORS } from '@/lib/countries'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

const MOCK_RATES: Record<string, number> = {
  'USD-INR': 81.99, 'USD-NPR': 131.50, 'USD-PHP': 55.36,
  'GBP-INR': 104.02, 'USD-MXN': 16.89, 'AED-INR': 22.33,
  'USD-PKR': 274.33, 'USD-BDT': 108.84,
}

export function CorridorShowcase() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Popular Corridors
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Live exchange rates on our most popular routes
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {POPULAR_CORRIDORS.map((corridor) => {
            const rate = MOCK_RATES[`${corridor.from}-${corridor.to}`] || 0
            return (
              <Link
                key={`${corridor.from}-${corridor.to}`}
                href={`/register?from=${corridor.from}&to=${corridor.to}`}
                className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-blue-300 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-500">{corridor.label}</span>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm text-gray-500">1 {corridor.from} =</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {rate.toFixed(2)} <span className="text-base font-normal text-gray-500">{corridor.to}</span>
                </div>
                <div className="mt-2 text-xs text-green-600 font-medium">
                  Fee from $0.99
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
