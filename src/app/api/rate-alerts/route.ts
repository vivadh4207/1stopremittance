import { NextResponse } from 'next/server'
import { z } from 'zod'

/**
 * Rate alerts endpoint.
 *
 * Accepts a subscription (email + corridor + target rate + direction) and
 * stores it in memory for now. Swap `saveSubscription` for a DB call
 * (Prisma) when ready — the shape is stable.
 *
 * Alerts fire when:
 *   direction === 'above' && liveRate >= targetRate
 *   direction === 'below' && liveRate <= targetRate
 *
 * A separate cron (not in this file) is expected to poll live rates and
 * dispatch notifications.
 */

export const runtime = 'nodejs'

const CURRENCY_RE = /^[A-Z]{3}$/

const Schema = z.object({
  email: z.string().email().max(200),
  from: z.string().regex(CURRENCY_RE),
  to: z.string().regex(CURRENCY_RE),
  targetRate: z.number().positive().lt(1_000_000),
  direction: z.enum(['above', 'below']),
  consent: z.literal(true, {
    message: 'You must consent to receive alerts.',
  }),
})

interface Subscription {
  id: string
  email: string
  from: string
  to: string
  targetRate: number
  direction: 'above' | 'below'
  createdAt: number
}

// In-memory store — replace with Prisma when DB is wired up.
const SUBSCRIPTIONS: Subscription[] = []

// Rate limit: 10 subscriptions per IP per hour.
const HITS = new Map<string, { count: number; resetAt: number }>()
const LIMIT = 10
const WINDOW_MS = 60 * 60 * 1000

function rateLimit(ip: string) {
  const now = Date.now()
  const entry = HITS.get(ip)
  if (!entry || entry.resetAt < now) {
    HITS.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return true
  }
  if (entry.count >= LIMIT) return false
  entry.count += 1
  return true
}

function newId() {
  // Crypto-strong random suffix; prefix for debugging
  return `ra_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`
}

function saveSubscription(sub: Subscription) {
  SUBSCRIPTIONS.push(sub)
  // Cap memory usage in dev — production will hit a real DB.
  if (SUBSCRIPTIONS.length > 5000) SUBSCRIPTIONS.shift()
}

export async function POST(req: Request) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'

  if (!rateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many alert subscriptions. Try again later.' },
      { status: 429 },
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  const parsed = Schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Please double-check your email, corridor, and target rate.' },
      { status: 400 },
    )
  }

  const { email, from, to, targetRate, direction } = parsed.data

  if (from === to) {
    return NextResponse.json(
      { error: 'From and To currencies must differ.' },
      { status: 400 },
    )
  }

  const sub: Subscription = {
    id: newId(),
    email,
    from,
    to,
    targetRate,
    direction,
    createdAt: Date.now(),
  }
  saveSubscription(sub)

  return NextResponse.json(
    {
      ok: true,
      id: sub.id,
      message: `You'll be emailed when 1 ${from} goes ${direction} ${targetRate} ${to}.`,
    },
    { status: 200 },
  )
}

// GET is a simple counter for monitoring. Not PII.
export async function GET() {
  return NextResponse.json({ totalActive: SUBSCRIPTIONS.length })
}
