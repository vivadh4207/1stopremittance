import { NextResponse } from 'next/server'
import { z } from 'zod'

/**
 * Contact submission endpoint.
 *
 * Stores nothing persistently yet — logs to the server and returns OK.
 * Hook this up to Resend / SendGrid / a DB table later by replacing the
 * `forwardToSink` function.
 *
 * Security:
 *  - Input validated with Zod (length limits, email shape)
 *  - Basic in-memory rate limit (per-IP) as a first line of defense
 *  - HTML stripped from message to prevent injection downstream
 */

export const runtime = 'nodejs'

const Schema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(200),
  topic: z.enum(['rates', 'corridor', 'bug', 'press', 'other']),
  message: z.string().min(10).max(2000),
})

// Very small per-IP rate limit (5 submits / 10 minutes).
// Resets every server cold start — adequate for a contact form, not for scale.
const HITS = new Map<string, { count: number; resetAt: number }>()
const LIMIT = 5
const WINDOW_MS = 10 * 60 * 1000

function rateLimit(ip: string) {
  const now = Date.now()
  const entry = HITS.get(ip)
  if (!entry || entry.resetAt < now) {
    HITS.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return { ok: true, remaining: LIMIT - 1 }
  }
  if (entry.count >= LIMIT) {
    return { ok: false, remaining: 0 }
  }
  entry.count += 1
  return { ok: true, remaining: LIMIT - entry.count }
}

function stripHtml(input: string) {
  return input.replace(/<[^>]*>/g, '').trim()
}

async function forwardToSink(payload: z.infer<typeof Schema>) {
  // Placeholder: in production, forward to Resend / SendGrid / DB.
  // Keep logs PII-lean — log topic + email domain only.
  const domain = payload.email.split('@')[1] ?? 'unknown'
  console.log(`[contact] topic=${payload.topic} emailDomain=${domain}`)
}

export async function POST(req: Request) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'

  const rl = rateLimit(ip)
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'Too many submissions. Please try again in a few minutes.' },
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
      { error: 'Please fill in all fields with valid values.' },
      { status: 400 },
    )
  }

  const clean = {
    ...parsed.data,
    name: stripHtml(parsed.data.name),
    message: stripHtml(parsed.data.message),
  }

  await forwardToSink(clean)

  return NextResponse.json({ ok: true }, { status: 200 })
}
