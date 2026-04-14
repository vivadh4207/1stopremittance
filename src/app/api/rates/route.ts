import { NextResponse } from 'next/server'
import { fetchLiveRates, generateLiveProviderRates } from '@/lib/rates'

// Revalidate every 2 hours (7200 seconds)
export const revalidate = 7200

/**
 * GET /api/rates
 * Returns live exchange rates and optionally provider-specific rates.
 *
 * Query params:
 *   ?from=USD&to=NGN           — get mid-market rate
 *   ?from=USD&to=NGN&amount=1000 — get provider comparison with amounts
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const from = searchParams.get('from')?.toUpperCase() || 'USD'
  const to = searchParams.get('to')?.toUpperCase() || 'NGN'
  const amountStr = searchParams.get('amount')
  const amount = amountStr ? parseFloat(amountStr) : null

  try {
    const rateData = await fetchLiveRates()

    const fromRate = rateData.rates[from] || 1
    const toRate = rateData.rates[to] || 1
    const midMarketRate = toRate / fromRate

    const response: Record<string, unknown> = {
      from,
      to,
      midMarketRate: +midMarketRate.toFixed(6),
      rates: rateData.rates,
      source: rateData.source,
      lastUpdated: rateData.lastUpdated,
      nextUpdate: rateData.nextUpdate,
    }

    // If amount provided, also generate provider comparison
    if (amount && amount > 0) {
      const providers = generateLiveProviderRates(amount, from, to, rateData.rates)
      response.amount = amount
      response.providers = providers
    }

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=7200, stale-while-revalidate=3600',
      },
    })
  } catch (error) {
    console.error('Rate fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch rates' },
      { status: 500 }
    )
  }
}
