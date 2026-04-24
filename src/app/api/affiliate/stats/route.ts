/**
 * GET /api/affiliate/stats
 * Returns public-facing affiliate revenue model estimates.
 * Used by the pricing/about pages to show transparency.
 */
import { NextResponse } from 'next/server'
import { AFFILIATE_CONFIGS, projectedAffiliateRevenue, revenueProjection } from '@/lib/business-model'

export async function GET() {
  const providerCount = Object.keys(AFFILIATE_CONFIGS).length
  const withPrograms = Object.values(AFFILIATE_CONFIGS).filter((c) => c.hasProgram).length
  const avgCpa = Object.values(AFFILIATE_CONFIGS).reduce((s, c) => s + c.cpaUsd, 0) / providerCount

  // Projections at different scale points
  const projections = [10_000, 50_000, 100_000, 500_000].map((mau) => ({
    monthlyActiveUsers: mau,
    ...revenueProjection(mau),
  }))

  return NextResponse.json({
    model: 'Affiliate CPA + Premium Subscriptions + White-label API + Featured Placements',
    providers: {
      total: providerCount,
      withAffiliatePrograms: withPrograms,
      avgCpaUsd: +avgCpa.toFixed(2),
    },
    projections,
    transparency: 'We earn a commission when you click through to a provider. This never affects the rates we show — all rates are fetched live from providers.',
  }, {
    headers: { 'Cache-Control': 'public, s-maxage=3600' },
  })
}
