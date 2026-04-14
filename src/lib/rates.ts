/**
 * Live Exchange Rate Service
 *
 * Fetches real exchange rates from multiple free APIs with fallback chain:
 *   1. Frankfurter API (ECB data, free, no key)
 *   2. ExchangeRate.host (free tier)
 *   3. Hardcoded fallback rates (always available)
 *
 * Rates are cached server-side via Next.js ISR (revalidates every 2 hours).
 */

// Fallback rates — used when all APIs fail. Updated manually as a safety net.
const FALLBACK_RATES: Record<string, number> = {
  USD: 1,
  NGN: 1550,
  PHP: 56.2,
  INR: 83.5,
  GBP: 0.79,
  EUR: 0.92,
  MXN: 17.1,
  PKR: 278,
  GHS: 14.8,
  KES: 153,
  BDT: 110,
  CAD: 1.36,
}

// All currency codes we support
const SUPPORTED_CURRENCIES = Object.keys(FALLBACK_RATES)

export interface RateData {
  rates: Record<string, number> // All rates relative to USD
  source: 'frankfurter' | 'exchangerate-host' | 'open-exchange' | 'fallback'
  lastUpdated: string // ISO timestamp
  nextUpdate: string // ISO timestamp (approx)
}

/**
 * Fetch rates from Frankfurter API (European Central Bank data).
 * Free, no API key required. Covers ~33 currencies but NOT NGN, GHS, KES, BDT, PKR.
 */
async function fetchFrankfurter(): Promise<Record<string, number> | null> {
  try {
    const currencies = SUPPORTED_CURRENCIES.filter((c) => c !== 'USD').join(',')
    const res = await fetch(
      `https://api.frankfurter.app/latest?from=USD&to=${currencies}`,
      { next: { revalidate: 7200 } } // Cache for 2 hours
    )
    if (!res.ok) return null
    const data = await res.json()
    if (!data.rates) return null
    return { USD: 1, ...data.rates }
  } catch {
    return null
  }
}

/**
 * Fetch rates from Open Exchange Rates (free tier: 1000 req/month).
 * Requires APP_ID env var. Covers all currencies including NGN, GHS, etc.
 */
async function fetchOpenExchangeRates(): Promise<Record<string, number> | null> {
  const appId = process.env.OPEN_EXCHANGE_RATES_APP_ID
  if (!appId) return null

  try {
    const symbols = SUPPORTED_CURRENCIES.join(',')
    const res = await fetch(
      `https://openexchangerates.org/api/latest.json?app_id=${appId}&symbols=${symbols}`,
      { next: { revalidate: 7200 } }
    )
    if (!res.ok) return null
    const data = await res.json()
    if (!data.rates) return null
    return data.rates
  } catch {
    return null
  }
}

/**
 * Fetch rates from ExchangeRate.host (free, no key, wide coverage).
 */
async function fetchExchangeRateHost(): Promise<Record<string, number> | null> {
  try {
    const symbols = SUPPORTED_CURRENCIES.join(',')
    const res = await fetch(
      `https://api.exchangerate.host/live?access_key=${process.env.EXCHANGERATE_HOST_KEY || ''}&currencies=${symbols}&source=USD`,
      { next: { revalidate: 7200 } }
    )
    if (!res.ok) return null
    const data = await res.json()
    if (!data.quotes) return null

    // exchangerate.host returns keys like "USDNGN", "USDPHP", etc.
    const rates: Record<string, number> = { USD: 1 }
    for (const [key, val] of Object.entries(data.quotes)) {
      const currency = key.replace('USD', '')
      if (typeof val === 'number') {
        rates[currency] = val
      }
    }
    return rates
  } catch {
    return null
  }
}

/**
 * Main function: Fetch live rates with multi-source fallback.
 * Called from API route / server components.
 */
export async function fetchLiveRates(): Promise<RateData> {
  const now = new Date()
  const nextUpdate = new Date(now.getTime() + 2 * 60 * 60 * 1000) // +2 hours

  // Try sources in order of preference
  // 1. Open Exchange Rates (best coverage if API key is set)
  const openExRates = await fetchOpenExchangeRates()
  if (openExRates && Object.keys(openExRates).length >= 8) {
    return {
      rates: mergeWithFallback(openExRates),
      source: 'open-exchange',
      lastUpdated: now.toISOString(),
      nextUpdate: nextUpdate.toISOString(),
    }
  }

  // 2. Frankfurter (free, no key needed — but doesn't have NGN, GHS, KES, etc.)
  const frankfurterRates = await fetchFrankfurter()
  if (frankfurterRates && Object.keys(frankfurterRates).length >= 4) {
    return {
      rates: mergeWithFallback(frankfurterRates),
      source: 'frankfurter',
      lastUpdated: now.toISOString(),
      nextUpdate: nextUpdate.toISOString(),
    }
  }

  // 3. ExchangeRate.host
  const erHostRates = await fetchExchangeRateHost()
  if (erHostRates && Object.keys(erHostRates).length >= 4) {
    return {
      rates: mergeWithFallback(erHostRates),
      source: 'exchangerate-host',
      lastUpdated: now.toISOString(),
      nextUpdate: nextUpdate.toISOString(),
    }
  }

  // 4. Fallback to hardcoded rates
  return {
    rates: { ...FALLBACK_RATES },
    source: 'fallback',
    lastUpdated: now.toISOString(),
    nextUpdate: nextUpdate.toISOString(),
  }
}

/**
 * Merge fetched rates with fallback rates (fills in any missing currencies).
 */
function mergeWithFallback(fetched: Record<string, number>): Record<string, number> {
  const merged: Record<string, number> = { ...FALLBACK_RATES }
  for (const [currency, rate] of Object.entries(fetched)) {
    if (SUPPORTED_CURRENCIES.includes(currency) && typeof rate === 'number' && rate > 0) {
      merged[currency] = rate
    }
  }
  return merged
}

/**
 * Calculate exchange rate between any two supported currencies.
 */
export function calcRate(rates: Record<string, number>, from: string, to: string): number {
  const fromRate = rates[from] || 1
  const toRate = rates[to] || 1
  return toRate / fromRate
}

/**
 * Generate provider-specific rates with realistic spreads.
 * Each provider applies a different markup to the mid-market rate.
 */
export function generateLiveProviderRates(
  amount: number,
  from: string,
  to: string,
  rates: Record<string, number>
) {
  const { PROVIDERS } = require('@/lib/constants')
  const baseRate = calcRate(rates, from, to)

  // Deterministic per-provider spreads (based on provider characteristics)
  const PROVIDER_SPREADS: Record<string, { marginPct: number; baseFee: number }> = {
    wise: { marginPct: 0.005, baseFee: 1.50 },       // 0.5% markup, $1.50 fee — best rates
    remitly: { marginPct: 0.012, baseFee: 0.00 },     // 1.2% markup, $0 fee — "free" but rate markup
    westernunion: { marginPct: 0.025, baseFee: 4.99 }, // 2.5% markup, $4.99 fee — expensive
    xoom: { marginPct: 0.015, baseFee: 0.00 },        // 1.5% markup, $0 fee
    worldremit: { marginPct: 0.010, baseFee: 2.99 },   // 1.0% markup, $2.99 fee
    ofx: { marginPct: 0.008, baseFee: 0.00 },         // 0.8% markup, $0 fee — good for large amounts
    moneygram: { marginPct: 0.030, baseFee: 3.99 },   // 3.0% markup, $3.99 fee — cash pickup premium
    sendwave: { marginPct: 0.018, baseFee: 0.00 },    // 1.8% markup, $0 fee — Africa specialist
  }

  return PROVIDERS.map((p: typeof PROVIDERS[number]) => {
    const spread = PROVIDER_SPREADS[p.id] || { marginPct: 0.02, baseFee: 2.99 }
    const rate = baseRate * (1 - spread.marginPct)
    const fee = spread.baseFee
    const received = +((amount - fee) * rate).toFixed(2)
    return {
      ...p,
      rate: +rate.toFixed(4),
      fee,
      received,
      total: +amount.toFixed(2),
      markup: +(spread.marginPct * 100).toFixed(2), // e.g. "0.50" for 0.5%
    }
  }).sort((a: { received: number }, b: { received: number }) => b.received - a.received)
}
