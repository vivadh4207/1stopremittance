/**
 * 1StopRemittance — Business Model & Revenue Configuration
 *
 * Revenue streams:
 *  1. Affiliate / CPA fees   — earn per converted click to providers
 *  2. Premium subscriptions  — advanced rate alerts, analytics, price lock
 *  3. White-label API        — B2B rate data & widget licensing
 *  4. Featured placements    — sponsored slots in comparison results
 *  5. B2B corridor reports   — paid market intelligence
 *  6. Currency-deal cashback — exclusive negotiated rates for high-volume senders
 */

// ─── 1. Affiliate / CPA Program ──────────────────────────────────────────────

export interface AffiliateConfig {
  providerId: string
  /** CPA payout per new funded transfer (USD) */
  cpaUsd: number
  /** Revenue-share % of provider fee on referred transfers */
  revenueSharePct: number
  /** Affiliate link template. {REF} replaced with our tracking code */
  affiliateLinkTemplate: string
  /** Whether this provider has a formal affiliate program */
  hasProgram: boolean
  /** Program name/network */
  programNetwork?: string
}

export const AFFILIATE_CONFIGS: Record<string, AffiliateConfig> = {
  wise: {
    providerId: 'wise',
    cpaUsd: 20,
    revenueSharePct: 0,
    affiliateLinkTemplate: 'https://wise.com/invite/u/{REF}',
    hasProgram: true,
    programNetwork: 'Wise Affiliates (direct)',
  },
  remitly: {
    providerId: 'remitly',
    cpaUsd: 15,
    revenueSharePct: 0,
    affiliateLinkTemplate: 'https://remitly.com/?utm_source=1stopremittance&utm_medium=affiliate&ref={REF}',
    hasProgram: true,
    programNetwork: 'Impact.com',
  },
  westernunion: {
    providerId: 'westernunion',
    cpaUsd: 10,
    revenueSharePct: 0,
    affiliateLinkTemplate: 'https://westernunion.com/?utm_source=1stopremittance&utm_campaign=affiliate&ref={REF}',
    hasProgram: true,
    programNetwork: 'CJ Affiliate',
  },
  worldremit: {
    providerId: 'worldremit',
    cpaUsd: 18,
    revenueSharePct: 0,
    affiliateLinkTemplate: 'https://worldremit.com/?utm_source=1stopremittance&ref={REF}',
    hasProgram: true,
    programNetwork: 'Awin',
  },
  xoom: {
    providerId: 'xoom',
    cpaUsd: 12,
    revenueSharePct: 0,
    affiliateLinkTemplate: 'https://xoom.com/?ref={REF}&utm_source=1stopremittance',
    hasProgram: true,
    programNetwork: 'PayPal Partner Network',
  },
  moneygram: {
    providerId: 'moneygram',
    cpaUsd: 8,
    revenueSharePct: 0,
    affiliateLinkTemplate: 'https://moneygram.com/?utm_source=1stopremittance&ref={REF}',
    hasProgram: true,
    programNetwork: 'CJ Affiliate',
  },
  sendwave: {
    providerId: 'sendwave',
    cpaUsd: 14,
    revenueSharePct: 0,
    affiliateLinkTemplate: 'https://sendwave.com/r/{REF}',
    hasProgram: true,
    programNetwork: 'Direct',
  },
  ofx: {
    providerId: 'ofx',
    cpaUsd: 25,
    revenueSharePct: 0,
    affiliateLinkTemplate: 'https://ofx.com/?utm_source=1stopremittance&ref={REF}',
    hasProgram: true,
    programNetwork: 'Direct',
  },
}

/** Build a tracked affiliate link for a provider */
export function buildAffiliateLink(providerId: string, sessionId?: string): string {
  const config = AFFILIATE_CONFIGS[providerId]
  if (!config) return '#'
  const ref = sessionId ?? '1stopremittance'
  return config.affiliateLinkTemplate.replace('{REF}', ref)
}

/** Estimated monthly affiliate revenue at given monthly unique visitors */
export function projectedAffiliateRevenue(monthlyUniqueVisitors: number) {
  const clickThroughRate = 0.18        // 18% of visitors click a provider link
  const conversionRate = 0.12          // 12% of clicks become funded transfers
  const avgCpa = 15                    // avg $15 CPA across providers
  const clicks = monthlyUniqueVisitors * clickThroughRate
  const conversions = clicks * conversionRate
  return {
    clicks: Math.round(clicks),
    conversions: Math.round(conversions),
    estimatedRevenue: Math.round(conversions * avgCpa),
  }
}

// ─── 2. Premium Subscription Plans ──────────────────────────────────────────

export interface PricingPlan {
  id: string
  name: string
  price: number           // monthly USD
  priceAnnual: number     // annual USD (per month)
  badge?: string
  highlighted?: boolean
  description: string
  features: string[]
  limits: {
    rateAlerts: number | 'unlimited'
    corridors: number | 'unlimited'
    historicalDays: number | 'unlimited'
    apiCalls: number | 'unlimited'
  }
  cta: string
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    priceAnnual: 0,
    description: 'Everything you need to compare rates and send smarter.',
    cta: 'Get Started Free',
    limits: { rateAlerts: 2, corridors: 3, historicalDays: 7, apiCalls: 0 },
    features: [
      'Live rate comparison (8+ providers)',
      'Up to 2 rate alert corridors',
      '3-day rate history',
      'Basic fee calculator',
      'Community guides',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 4.99,
    priceAnnual: 3.99,
    badge: 'Most Popular',
    highlighted: true,
    description: 'For regular senders who want the best rate every time.',
    cta: 'Start 14-day free trial',
    limits: { rateAlerts: 'unlimited', corridors: 'unlimited', historicalDays: 90, apiCalls: 0 },
    features: [
      'Everything in Free',
      'Unlimited rate alerts (SMS + email)',
      'Rate trend charts (90-day history)',
      'Best-time-to-send predictions',
      'Multi-corridor dashboard',
      'Ad-free experience',
      'Priority customer support',
    ],
  },
  {
    id: 'business',
    name: 'Business',
    price: 19.99,
    priceAnnual: 14.99,
    description: 'For SMBs, importers, freelancers with recurring FX needs.',
    cta: 'Start 14-day free trial',
    limits: { rateAlerts: 'unlimited', corridors: 'unlimited', historicalDays: 365, apiCalls: 5000 },
    features: [
      'Everything in Pro',
      '12-month rate history & export (CSV)',
      'Rate lock alerts (when rate hits target)',
      'Batch transfer calculator',
      'API access (5,000 calls/month)',
      'Embeddable rate widget for your website',
      'Dedicated account manager',
      'Invoice currency calculator',
    ],
  },
]

// ─── 3. White-Label API Tiers ────────────────────────────────────────────────

export interface ApiTier {
  id: string
  name: string
  monthlyUsd: number
  annualDiscountPct: number
  callsPerMonth: number | 'unlimited'
  rateLatencyMs: number
  sla: string
  targetCustomer: string
  features: string[]
}

export const API_TIERS: ApiTier[] = [
  {
    id: 'starter',
    name: 'API Starter',
    monthlyUsd: 99,
    annualDiscountPct: 20,
    callsPerMonth: 10_000,
    rateLatencyMs: 500,
    sla: 'Best effort',
    targetCustomer: 'Fintech startups, developers',
    features: [
      'Live mid-market rates (8+ providers)',
      '30+ currency pairs',
      'JSON REST API',
      'Basic webhooks',
      'Sandbox environment',
    ],
  },
  {
    id: 'growth',
    name: 'API Growth',
    monthlyUsd: 499,
    annualDiscountPct: 20,
    callsPerMonth: 100_000,
    rateLatencyMs: 200,
    sla: '99.5% uptime',
    targetCustomer: 'Credit unions, community banks, neobanks',
    features: [
      'Everything in Starter',
      'Provider fee data (not just mid-market)',
      'Historical rate data (1 year)',
      'White-label embeddable widget',
      'Dedicated subdomain (rates.yourbank.com)',
      'Co-branded experience',
      'Webhooks + real-time streaming',
    ],
  },
  {
    id: 'enterprise',
    name: 'API Enterprise',
    monthlyUsd: 0,   // Custom pricing
    annualDiscountPct: 0,
    callsPerMonth: 'unlimited',
    rateLatencyMs: 50,
    sla: '99.99% uptime SLA',
    targetCustomer: 'Banks, MSBs, remittance platforms',
    features: [
      'Everything in Growth',
      'Custom corridor coverage',
      'Sub-50ms rate feeds',
      'On-premise / private cloud deployment',
      'Dedicated infrastructure',
      'Custom SLA & support',
      'White-glove onboarding',
      'Revenue share on referred transfers',
    ],
  },
]

// ─── 4. Featured Provider Placements ────────────────────────────────────────

export interface FeaturedPlacement {
  type: 'top-slot' | 'badge' | 'corridor-sponsor' | 'homepage-feature'
  monthlyUsd: number
  description: string
  disclosure: string  // Required FTC disclosure text
}

export const FEATURED_PLACEMENTS: Record<string, FeaturedPlacement> = {
  'top-slot': {
    type: 'top-slot',
    monthlyUsd: 1500,
    description: 'Appear as the first result in all comparison tables (labeled "Sponsored")',
    disclosure: 'Sponsored — This provider pays for top placement. Rates shown are live and accurate.',
  },
  'badge': {
    type: 'badge',
    monthlyUsd: 500,
    description: 'Display a "Partner" or "Recommended" badge on your provider card',
    disclosure: 'Partner — 1StopRemittance has a commercial relationship with this provider.',
  },
  'corridor-sponsor': {
    type: 'corridor-sponsor',
    monthlyUsd: 800,
    description: 'Sponsor a specific corridor page (e.g., USD→NGN) — logo, call-out, exclusive deal',
    disclosure: 'Sponsored corridor — rates and fees are live and unaffected by sponsorship.',
  },
  'homepage-feature': {
    type: 'homepage-feature',
    monthlyUsd: 2000,
    description: 'Featured spot on the homepage hero and "Trusted Partners" section',
    disclosure: 'Featured partner — this placement is paid. All rate data remains independent.',
  },
}

// ─── 5. Additional Revenue Streams (researched) ──────────────────────────────

export const ADDITIONAL_REVENUE_STREAMS = [
  {
    id: 'corridor-reports',
    name: 'B2B Corridor Intelligence Reports',
    description: 'Monthly PDF/data reports on remittance volume trends, rate volatility, and fee benchmarking per corridor. Sold to banks, NGOs, and research firms.',
    pricingModel: '$299–$999/report or $2,499/year subscription',
    targetBuyer: 'Central banks, development finance institutions, fintech VCs, academic researchers',
    estimatedAnnualRevenue: '$50k–$200k at scale',
  },
  {
    id: 'currency-deal-cashback',
    name: 'Exclusive Rate Deals / Cashback',
    description: 'Negotiate exclusive rates or cashback promotions with providers for 1Stop users. Users save more, providers get more volume, we earn a higher CPA.',
    pricingModel: 'Enhanced CPA ($20–$50) or cashback funded by provider',
    targetBuyer: 'Wise, Remitly, WorldRemit (provider partnerships)',
    estimatedAnnualRevenue: '$100k–$500k with 2–3 provider deals',
  },
  {
    id: 'diaspora-banking-referrals',
    name: 'Diaspora-Focused Banking Referrals',
    description: 'Partner with neobanks targeting Nigerian, Filipino, Indian diaspora (e.g., Majority, Greenwood, Daylight). Earn referral fees when users open accounts.',
    pricingModel: '$30–$80 CPA per funded account',
    targetBuyer: 'Majority, Grey.co, Payday, Kuda Bank',
    estimatedAnnualRevenue: '$50k–$300k',
  },
  {
    id: 'financial-literacy-courses',
    name: 'Paid Remittance & FX Literacy Courses',
    description: 'Short video courses on topics like "How to save $500/yr on remittances", "Timing FX for the best rates", "Starting a US business as an immigrant". Sold via Gumroad or Teachable.',
    pricingModel: '$9.99–$49.99 one-time course purchase',
    targetBuyer: 'Diaspora senders, new immigrants',
    estimatedAnnualRevenue: '$20k–$100k',
  },
  {
    id: 'transaction-alerts-sms',
    name: 'SMS Rate Alert Add-on',
    description: 'Standalone SMS-only plan for users who prefer text over email/app. Carrier-grade delivery via Twilio.',
    pricingModel: '$1.99/month SMS add-on',
    targetBuyer: 'Feature phone users, older diaspora senders',
    estimatedAnnualRevenue: '$10k–$50k',
  },
]

// ─── Revenue Projections ──────────────────────────────────────────────────────

export function revenueProjection(monthlyActiveUsers: number) {
  const affiliate = projectedAffiliateRevenue(monthlyActiveUsers)
  const premiumConversionRate = 0.04  // 4% of MAU upgrade to paid plans
  const avgPremiumArpu = 7.50         // blended Pro + Business ARPU
  const premiumRevenue = monthlyActiveUsers * premiumConversionRate * avgPremiumArpu
  const apiRevenue = 2499             // assume 1 Growth + 2 Starter customers to start
  const featuredRevenue = 3000        // assume 2 corridor sponsors

  return {
    affiliate: affiliate.estimatedRevenue,
    premium: Math.round(premiumRevenue),
    api: apiRevenue,
    featured: featuredRevenue,
    total: Math.round(affiliate.estimatedRevenue + premiumRevenue + apiRevenue + featuredRevenue),
  }
}
