/**
 * GET /api/affiliate/click?provider=wise&corridor=usd-ngn&amount=500
 *
 * Records an affiliate click and redirects the user to the provider
 * with our tracking code embedded. This ensures every provider click
 * is logged for commission attribution.
 *
 * OWASP:
 * - A03: provider allowlisting prevents open redirect abuse
 * - A04: rate-limited to prevent click fraud
 * - A09: logs click metadata without PII
 */

import { NextRequest, NextResponse } from 'next/server'
import { buildAffiliateLink, AFFILIATE_CONFIGS } from '@/lib/business-model'

// Rate limiting — max 20 clicks per IP per minute to prevent click fraud
const clickMap = new Map<string, { count: number; resetAt: number }>()

function checkClickLimit(ip: string): boolean {
  const now = Date.now()
  const entry = clickMap.get(ip)
  if (!entry || entry.resetAt < now) {
    clickMap.set(ip, { count: 1, resetAt: now + 60_000 })
    return true
  }
  if (entry.count >= 20) return false
  entry.count++
  return true
}

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'

  if (!checkClickLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const { searchParams } = req.nextUrl
  const providerId = searchParams.get('provider')?.toLowerCase().trim()
  const corridor = searchParams.get('corridor')?.slice(0, 20) ?? ''
  const amount = searchParams.get('amount')?.slice(0, 10) ?? ''

  // OWASP A03: strict allowlist — only redirect to known providers
  if (!providerId || !AFFILIATE_CONFIGS[providerId]) {
    return NextResponse.json({ error: 'Unknown provider' }, { status: 400 })
  }

  const config = AFFILIATE_CONFIGS[providerId]

  // Build a session-specific tracking ID for attribution
  const sessionRef = `1stop_${Date.now().toString(36)}`
  const affiliateUrl = buildAffiliateLink(providerId, sessionRef)

  // Structured click log (no PII — just aggregate data)
  console.log(JSON.stringify({
    event: 'affiliate_click',
    provider: providerId,
    corridor,
    amount,
    sessionRef,
    hasProgram: config.hasProgram,
    estimatedCpa: config.cpaUsd,
    ts: new Date().toISOString(),
  }))

  // 302 redirect with cache-control to avoid browser caching the redirect
  return NextResponse.redirect(affiliateUrl, {
    status: 302,
    headers: {
      'Cache-Control': 'no-store, no-cache',
      'X-Robots-Tag': 'noindex',
    },
  })
}
