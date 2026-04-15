/**
 * Middleware: Locale Detection
 *
 * Detects the user's preferred language via:
 *   1. NEXT_LOCALE cookie (user already chose — always wins)
 *   2. x-vercel-ip-country header (Vercel's IP geolocation)
 *   3. Accept-Language header (browser preference)
 *   4. Falls back to 'en'
 *
 * Sets a NEXT_LOCALE cookie so next-intl can pick it up server-side.
 */

import { NextRequest, NextResponse } from 'next/server'
import { locales, defaultLocale, countryToLocale, type Locale } from './i18n/config'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // If user already has a valid locale cookie, respect it
  const existingLocale = request.cookies.get('NEXT_LOCALE')?.value
  if (existingLocale && locales.includes(existingLocale as Locale)) {
    return response
  }

  let detected: Locale = defaultLocale

  // 1. Try Vercel's IP country header
  const country = request.headers.get('x-vercel-ip-country')
  if (country && countryToLocale[country]) {
    detected = countryToLocale[country]
  } else {
    // 2. Try Accept-Language header
    const acceptLang = request.headers.get('accept-language') || ''
    const fromHeader = parseAcceptLanguage(acceptLang)
    if (fromHeader) {
      detected = fromHeader
    }
  }

  // Set cookie (1 year expiry)
  response.cookies.set('NEXT_LOCALE', detected, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  })

  return response
}

/** Parse Accept-Language header and return the first matching locale */
function parseAcceptLanguage(header: string): Locale | null {
  const entries = header
    .split(',')
    .map((part) => {
      const [lang, q] = part.trim().split(';q=')
      return { lang: lang.trim().toLowerCase(), q: q ? parseFloat(q) : 1 }
    })
    .sort((a, b) => b.q - a.q)

  for (const { lang } of entries) {
    if (locales.includes(lang as Locale)) return lang as Locale
    // Base language match: "es-MX" → "es", "fil-PH" → "fil"
    const base = lang.split('-')[0]
    if (locales.includes(base as Locale)) return base as Locale
    // Special: "tl" (Tagalog ISO code) → "fil"
    if (base === 'tl') return 'fil'
  }

  return null
}

export const config = {
  // Run on all pages except static assets and API routes
  matcher: ['/((?!_next|api|favicon\\.ico|.*\\..*).*)'],
}
