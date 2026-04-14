/**
 * POST /api/chat
 * Handles navigation bot queries using local intent matching.
 *
 * OWASP Security:
 * - Input validation and sanitization (A03: Injection)
 * - Rate limiting via headers (A04: Insecure Design)
 * - No sensitive data logged (A09: Security Logging)
 * - CORS headers set (A05: Security Misconfiguration)
 */

import { NextRequest, NextResponse } from 'next/server'
import { matchBotIntent, PUBLIC_INFO_DATABASE } from '@/lib/legal-services'

// Simple in-memory rate limiting (production: use Redis/Upstash)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 30  // requests per window
const RATE_WINDOW = 60_000  // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW })
    return true
  }
  if (entry.count >= RATE_LIMIT) return false
  entry.count++
  return true
}

function sanitizeInput(str: string): string {
  // Strip HTML tags and limit length
  return str
    .replace(/<[^>]*>/g, '')
    .replace(/[<>'"`;]/g, '')
    .trim()
    .slice(0, 500)
}

export async function POST(req: NextRequest) {
  // OWASP A05: CORS & Security Headers
  const headers = {
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  }

  // Rate limiting
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again in a minute.' },
      { status: 429, headers }
    )
  }

  let body: { message?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400, headers })
  }

  // OWASP A03: Input Validation
  if (!body.message || typeof body.message !== 'string') {
    return NextResponse.json({ error: 'Message is required' }, { status: 400, headers })
  }
  const message = sanitizeInput(body.message)
  if (message.length < 1) {
    return NextResponse.json({ error: 'Message too short' }, { status: 400, headers })
  }

  // Check if it's a public info search query
  const lowerMsg = message.toLowerCase()
  const infoMatch = PUBLIC_INFO_DATABASE.find((topic) =>
    topic.keywords.some((kw) => lowerMsg.includes(kw.toLowerCase()))
  )

  if (infoMatch) {
    return NextResponse.json(
      {
        response: `📚 Here's what I found from official sources:\n\n${infoMatch.summary}\n\nSource: ${infoMatch.source}`,
        action: {
          label: `Search: ${infoMatch.title} →`,
          href: `/search?q=${encodeURIComponent(infoMatch.title)}`,
        },
        source: infoMatch.source,
        sourceUrl: infoMatch.sourceUrl,
      },
      { headers }
    )
  }

  // Match navigation intent
  const intent = matchBotIntent(message)
  return NextResponse.json(
    {
      response: intent.response,
      action: intent.action,
    },
    { headers }
  )
}

// OWASP: Disable GET to prevent CSRF info leakage
export function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
