/**
 * POST /api/chat
 * Handles navigation bot queries using local intent matching.
 * No external AI APIs — purely keyword-based routing.
 */

import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 30
const RATE_WINDOW = 60_000

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
  return str
    .replace(/<[^>]*>/g, '')
    .replace(/[<>'"`;]/g, '')
    .trim()
    .slice(0, 500)
}

// Navigation intents for the bot
interface Intent {
  keywords: string[]
  response: string
  action: { label: string; href: string }
}

const INTENTS: Intent[] = [
  {
    keywords: ['compare', 'rate', 'rates', 'exchange', 'best rate', 'cheapest'],
    response: "I can help you compare rates! Our comparison tool shows live rates from 8+ providers so you can find the best deal.",
    action: { label: 'Compare Rates →', href: '/compare' },
  },
  {
    keywords: ['nigeria', 'naira', 'ngn', 'send to nigeria'],
    response: "Sending to Nigeria? We compare rates from Wise, Remitly, Western Union, and more for the USD→NGN corridor. Check out the latest rates!",
    action: { label: 'USD to NGN Rates →', href: '/corridors/usd-to-ngn' },
  },
  {
    keywords: ['philippines', 'peso', 'php', 'filipino', 'balikbayan', 'gcash'],
    response: "For sending to the Philippines, we compare GCash, bank transfer, and cash pickup rates. See which provider gives you the most pesos!",
    action: { label: 'USD to PHP Rates →', href: '/corridors/usd-to-php' },
  },
  {
    keywords: ['india', 'inr', 'rupee'],
    response: "We track USD to INR rates across all major providers. Find the best rate for sending to India.",
    action: { label: 'USD to INR Rates →', href: '/corridors/usd-to-inr' },
  },
  {
    keywords: ['ghana', 'cedi', 'ghs'],
    response: "Sending to Ghana? Compare USD to GHS rates and find the best provider for your transfer.",
    action: { label: 'USD to GHS Rates →', href: '/corridors/usd-to-ghs' },
  },
  {
    keywords: ['mexico', 'mxn', 'mexican'],
    response: "Compare rates for sending money to Mexico. We track all major providers for the USD→MXN corridor.",
    action: { label: 'USD to MXN Rates →', href: '/corridors/usd-to-mxn' },
  },
  {
    keywords: ['kenya', 'kes', 'mpesa', 'm-pesa'],
    response: "For Kenya transfers, we compare rates including M-Pesa delivery options. Find the best USD to KES rate!",
    action: { label: 'USD to KES Rates →', href: '/corridors/usd-to-kes' },
  },
  {
    keywords: ['corridor', 'countries', 'where', 'destinations'],
    response: "We support 8 corridors: Nigeria, Philippines, India, Ghana, Mexico, Kenya, Pakistan, and Bangladesh. Browse them all!",
    action: { label: 'All Corridors →', href: '/corridors' },
  },
  {
    keywords: ['guide', 'how to', 'learn', 'tips', 'help', 'article'],
    response: "We have free guides on sending money abroad — covering Nigeria, Philippines, fee avoidance, and rate timing tips.",
    action: { label: 'Read Guides →', href: '/guides' },
  },
  {
    keywords: ['advisor', 'consultant', 'expert', 'help me'],
    response: "Our verified remittance advisors can help you find the best option for your specific needs. Browse the directory!",
    action: { label: 'Find an Advisor →', href: '/advisors' },
  },
  {
    keywords: ['become advisor', 'list my', 'advertise', 'join', 'subscription'],
    response: "Want to be listed as a remittance advisor? We offer plans starting at $29/month with featured placement on corridor pages.",
    action: { label: 'Become an Advisor →', href: '/advisors/join' },
  },
  {
    keywords: ['wise', 'transferwise'],
    response: "Wise typically offers the lowest markup (around 0.5%) with a small flat fee. Great for large transfers!",
    action: { label: 'See Wise Rates →', href: '/compare' },
  },
  {
    keywords: ['remitly'],
    response: "Remitly offers zero-fee transfers but applies a higher rate markup (~1.2%). Good for speed — many transfers arrive in minutes.",
    action: { label: 'Compare Remitly →', href: '/compare' },
  },
  {
    keywords: ['western union', 'wu'],
    response: "Western Union is widely available for cash pickup but tends to have higher fees and markups. Compare to see if it's your best option.",
    action: { label: 'Compare WU Rates →', href: '/compare' },
  },
  {
    keywords: ['fee', 'fees', 'cost', 'hidden', 'charge'],
    response: "Hidden fees are the #1 issue with remittances. We break down both the exchange rate markup AND the transfer fee so you see the true cost.",
    action: { label: 'Avoid Hidden Fees →', href: '/guides/avoid-hidden-fees-international-transfers' },
  },
  {
    keywords: ['about', 'who are you', 'what is this', 'what do you do'],
    response: "1StopRemittance is a free comparison platform for diaspora communities. We help you find the best rates and lowest fees for sending money home.",
    action: { label: 'About Us →', href: '/about' },
  },
  {
    keywords: ['privacy', 'data', 'cookie'],
    response: "We take your privacy seriously. Check out our privacy policy for details on how we handle your data.",
    action: { label: 'Privacy Policy →', href: '/privacy' },
  },
]

function matchIntent(message: string): { response: string; action: { label: string; href: string } } {
  const lower = message.toLowerCase()

  for (const intent of INTENTS) {
    if (intent.keywords.some((kw) => lower.includes(kw))) {
      return { response: intent.response, action: intent.action }
    }
  }

  return {
    response: "I can help you compare remittance rates, find the best provider for your corridor, or connect you with an advisor. What would you like to do?",
    action: { label: 'Compare Rates →', href: '/compare' },
  }
}

export async function POST(req: NextRequest) {
  const headers = {
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  }

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

  if (!body.message || typeof body.message !== 'string') {
    return NextResponse.json({ error: 'Message is required' }, { status: 400, headers })
  }

  const message = sanitizeInput(body.message)
  if (message.length < 1) {
    return NextResponse.json({ error: 'Message too short' }, { status: 400, headers })
  }

  const intent = matchIntent(message)
  return NextResponse.json(
    { response: intent.response, action: intent.action },
    { headers }
  )
}

export function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
