/**
 * GET /api/legal/search?q=your+query
 * Searches the public information database for government information.
 *
 * Returns curated public-domain information sourced from official government websites.
 */

import { NextRequest, NextResponse } from 'next/server'
import { PUBLIC_INFO_DATABASE, LEGAL_PRODUCTS } from '@/lib/legal-services'

// Simple rate limiting
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 })
    return true
  }
  if (entry.count >= 60) return false
  entry.count++
  return true
}

export async function GET(req: NextRequest) {
  const headers = {
    'X-Content-Type-Options': 'nosniff',
    'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=900',
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers })
  }

  const query = req.nextUrl.searchParams.get('q')
    ?.replace(/<[^>]*>/g, '')
    .trim()
    .slice(0, 200)

  if (!query || query.length < 2) {
    // Return all topics when no query
    return NextResponse.json(
      {
        results: PUBLIC_INFO_DATABASE.map((t) => ({
          id: t.id,
          title: t.title,
          summary: t.summary,
          source: t.source,
          sourceUrl: t.sourceUrl,
          category: t.category,
        })),
        total: PUBLIC_INFO_DATABASE.length,
      },
      { headers }
    )
  }

  const lower = query.toLowerCase()

  // Search public info database
  const infoResults = PUBLIC_INFO_DATABASE.filter(
    (topic) =>
      topic.title.toLowerCase().includes(lower) ||
      topic.summary.toLowerCase().includes(lower) ||
      topic.keywords.some((kw) => lower.includes(kw.toLowerCase()) || kw.toLowerCase().includes(lower)) ||
      topic.content.toLowerCase().includes(lower)
  ).map((topic) => ({
    type: 'info' as const,
    id: topic.id,
    title: topic.title,
    summary: topic.summary,
    source: topic.source,
    sourceUrl: topic.sourceUrl,
    category: topic.category,
    relevance: topic.keywords.filter((kw) => lower.includes(kw.toLowerCase())).length,
  }))

  // Search products
  const productResults = LEGAL_PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(lower) ||
      p.description.toLowerCase().includes(lower) ||
      p.category.includes(lower)
  ).map((p) => ({
    type: 'service' as const,
    id: p.id,
    title: p.name,
    summary: p.description,
    price: p.price,
    slug: p.slug,
    icon: p.icon,
  }))

  // Sort info results by relevance
  infoResults.sort((a, b) => b.relevance - a.relevance)

  return NextResponse.json(
    {
      query,
      results: [...infoResults, ...productResults],
      total: infoResults.length + productResults.length,
    },
    { headers }
  )
}
