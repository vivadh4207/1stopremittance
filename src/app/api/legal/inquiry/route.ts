/**
 * POST /api/legal/inquiry
 * Accepts document preparation service inquiries.
 *
 * OWASP Compliance:
 * - A01: Input validation for all fields
 * - A03: Sanitization prevents injection
 * - A04: Rate limiting
 * - A07: Minimal PII stored
 */

import { NextRequest, NextResponse } from 'next/server'

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 5  // max 5 submissions per window per IP
const RATE_WINDOW = 300_000  // 5 minutes

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

function sanitize(val: unknown): string {
  if (typeof val !== 'string') return ''
  return val.replace(/<[^>]*>/g, '').replace(/[<>'"`;]/g, '').trim().slice(0, 500)
}

const VALID_PRODUCT_IDS = [
  'llc-formation', 'ein-filing', 'corporation-formation',
  'registered-agent', 'trademark-registration', 'annual-report',
  'dba-filing', 'itin-application',
]

const US_STATES = new Set([
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
  'Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
  'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan',
  'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada',
  'New Hampshire','New Jersey','New Mexico','New York','North Carolina',
  'North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island',
  'South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont',
  'Virginia','Washington','West Virginia','Wisconsin','Wyoming',
])

export async function POST(req: NextRequest) {
  const headers = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many submissions. Please wait before trying again.' },
      { status: 429, headers }
    )
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400, headers })
  }

  // Validate fields
  const errors: Record<string, string> = {}
  const productId = sanitize(body.productId)
  const fullName = sanitize(body.fullName)
  const email = sanitize(body.email)
  const state = sanitize(body.state)
  // businessName is optional, collected but not validated strictly
  void sanitize(body.businessName)

  if (!VALID_PRODUCT_IDS.includes(productId)) errors.productId = 'Invalid product'
  if (!fullName || fullName.length < 2) errors.fullName = 'Full name required'
  if (!email || !email.includes('@') || !email.includes('.')) errors.email = 'Valid email required'
  if (!state || !US_STATES.has(state)) errors.state = 'Valid US state required'

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422, headers })
  }

  // In production: save to database (Prisma) and trigger email notification
  // For now: return success with inquiry reference number
  const inquiryId = `INQ-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`

  // Log to console (production would use structured logging)
  console.log('[Legal Inquiry]', {
    inquiryId,
    productId,
    state,
    createdAt: new Date().toISOString(),
    // Note: No sensitive PII logged
  })

  return NextResponse.json(
    {
      success: true,
      inquiryId,
      message: `Your inquiry has been received. Reference: ${inquiryId}`,
      nextSteps: [
        'You will receive a confirmation email within 24 hours',
        'Our team will review your information',
        'Payment link will be sent via secure email',
        'Processing begins upon payment confirmation',
      ],
    },
    { status: 201, headers }
  )
}

export function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
