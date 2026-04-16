import type { MetadataRoute } from 'next'

const BASE_URL = 'https://1stopremittance.com'

const CORRIDOR_SLUGS = [
  'usd-to-ngn',
  'usd-to-php',
  'usd-to-inr',
  'usd-to-ghs',
  'usd-to-mxn',
  'usd-to-kes',
  'usd-to-pkr',
  'usd-to-bdt',
]

const GUIDE_SLUGS = [
  'best-ways-send-money-nigeria',
  'cheapest-way-send-money-philippines',
  'nigerian-diaspora-remittance-guide',
  'filipino-balikbayan-remittance-tips',
  'avoid-hidden-fees-money-transfers',
  'exchange-rate-timing-tips',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1.0 },
    { url: `${BASE_URL}/compare`, lastModified: new Date(), changeFrequency: 'hourly' as const, priority: 0.9 },
    { url: `${BASE_URL}/corridors`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.8 },
    { url: `${BASE_URL}/guides`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    // Business model & monetization pages
    { url: `${BASE_URL}/pricing`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${BASE_URL}/api-access`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${BASE_URL}/search`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.6 },
    { url: `${BASE_URL}/faqs`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${BASE_URL}/rate-alerts`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.3 },
  ]

  const corridorPages = CORRIDOR_SLUGS.map((slug) => ({
    url: `${BASE_URL}/corridors/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  const guidePages = GUIDE_SLUGS.map((slug) => ({
    url: `${BASE_URL}/guides/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...corridorPages, ...guidePages]
}
