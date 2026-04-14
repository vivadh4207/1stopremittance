/**
 * Advisor Marketplace Data & Types
 *
 * Remittance advisors/consultants can pay a monthly subscription
 * to be listed on 1StopRemittance. They help users with:
 * - Finding the best providers for their corridor
 * - Navigating regulations and compliance
 * - Large/business transfers
 * - Tax implications of remittances
 *
 * Subscription Tiers:
 *   Basic ($29/mo)  — Listing in advisor directory
 *   Pro ($79/mo)    — Featured placement on corridor pages + badge
 *   Premium ($149/mo) — Top placement, featured on homepage, lead gen form
 */

export interface Advisor {
  id: string
  name: string
  title: string
  bio: string
  photo: string // URL or initials fallback
  specialties: string[]
  corridors: string[] // e.g. ['usd-to-ngn', 'usd-to-ghs']
  languages: string[]
  rating: number
  reviewCount: number
  tier: 'basic' | 'pro' | 'premium'
  contactEmail: string
  phone?: string
  website?: string
  location: string
  yearsExperience: number
  verified: boolean
}

export const SUBSCRIPTION_TIERS = [
  {
    id: 'basic',
    name: 'Basic',
    price: 29,
    interval: 'month' as const,
    features: [
      'Listed in advisor directory',
      'Profile with bio & specialties',
      'Contact button for leads',
      'Up to 3 corridor listings',
    ],
    cta: 'Start Basic',
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 79,
    interval: 'month' as const,
    features: [
      'Everything in Basic',
      'Featured badge on profile',
      'Shown on corridor pages',
      'Up to 8 corridor listings',
      'Priority in search results',
      'Monthly analytics report',
    ],
    cta: 'Go Pro',
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 149,
    interval: 'month' as const,
    features: [
      'Everything in Pro',
      'Top placement in directory',
      'Featured on homepage',
      'Unlimited corridor listings',
      'Direct lead gen form on profile',
      'Dedicated account manager',
      'Custom branding on profile',
    ],
    cta: 'Go Premium',
    popular: false,
  },
] as const

// Mock advisors for MVP (replace with database later)
export const MOCK_ADVISORS: Advisor[] = [
  {
    id: 'adv-001',
    name: 'Chioma Adebayo',
    title: 'Nigerian Remittance Specialist',
    bio: 'Helping Nigerian Americans navigate the best remittance options for over 8 years. Specializing in large transfers, business payments, and understanding CBN regulations. I help you get the most naira for your dollar.',
    photo: '',
    specialties: ['Nigeria Transfers', 'Business Remittances', 'Tax Advisory', 'CBN Compliance'],
    corridors: ['usd-to-ngn', 'usd-to-ghs'],
    languages: ['English', 'Yoruba', 'Igbo'],
    rating: 4.9,
    reviewCount: 127,
    tier: 'premium',
    contactEmail: 'chioma@example.com',
    phone: '+1 (832) 555-0147',
    website: 'https://example.com',
    location: 'Houston, TX',
    yearsExperience: 8,
    verified: true,
  },
  {
    id: 'adv-002',
    name: 'Marco Santos',
    title: 'Filipino Remittance Advisor',
    bio: 'Born in Manila, based in LA. I help Filipino Americans find the best ways to send money home — whether it\'s to GCash, BDO, or cash pickup. Saved my clients over $50,000 in fees last year.',
    photo: '',
    specialties: ['Philippines Transfers', 'GCash & Maya', 'Family Remittances', 'Rate Optimization'],
    corridors: ['usd-to-php'],
    languages: ['English', 'Tagalog', 'Cebuano'],
    rating: 4.8,
    reviewCount: 94,
    tier: 'pro',
    contactEmail: 'marco@example.com',
    location: 'Los Angeles, CA',
    yearsExperience: 6,
    verified: true,
  },
  {
    id: 'adv-003',
    name: 'Amara Okonkwo',
    title: 'Africa Remittance Consultant',
    bio: 'Specializing in African corridors — Nigeria, Ghana, and Kenya. I help diaspora families and small businesses find the cheapest and fastest ways to transfer money. Free initial consultation.',
    photo: '',
    specialties: ['Nigeria Transfers', 'Ghana Transfers', 'Kenya Transfers', 'Mobile Money'],
    corridors: ['usd-to-ngn', 'usd-to-ghs', 'usd-to-kes'],
    languages: ['English', 'Igbo', 'Pidgin'],
    rating: 4.7,
    reviewCount: 68,
    tier: 'pro',
    contactEmail: 'amara@example.com',
    location: 'Brooklyn, NY',
    yearsExperience: 5,
    verified: true,
  },
  {
    id: 'adv-004',
    name: 'Sofia Reyes',
    title: 'International Transfer Specialist',
    bio: 'Certified financial advisor helping immigrants navigate international money transfers. I work with clients sending to Philippines, Mexico, and across Asia. Let me help you save on every transfer.',
    photo: '',
    specialties: ['Philippines Transfers', 'Mexico Transfers', 'Large Transfers', 'Financial Planning'],
    corridors: ['usd-to-php', 'usd-to-mxn', 'usd-to-inr'],
    languages: ['English', 'Spanish', 'Tagalog'],
    rating: 4.6,
    reviewCount: 52,
    tier: 'basic',
    contactEmail: 'sofia@example.com',
    location: 'Chicago, IL',
    yearsExperience: 4,
    verified: true,
  },
  {
    id: 'adv-005',
    name: 'Emeka Nwosu',
    title: 'Business Remittance Expert',
    bio: 'Focused on helping Nigerian-owned businesses in the US send operational funds and payments to Nigeria. Expert in bulk transfers, trade finance, and compliance.',
    photo: '',
    specialties: ['Business Transfers', 'Trade Finance', 'Nigeria Compliance', 'Bulk Transfers'],
    corridors: ['usd-to-ngn'],
    languages: ['English', 'Igbo'],
    rating: 4.8,
    reviewCount: 43,
    tier: 'premium',
    contactEmail: 'emeka@example.com',
    phone: '+1 (713) 555-0298',
    website: 'https://example.com',
    location: 'Atlanta, GA',
    yearsExperience: 10,
    verified: true,
  },
  {
    id: 'adv-006',
    name: 'Grace Villanueva',
    title: 'Balikbayan Remittance Guide',
    bio: 'A proud Filipina American who understands the challenges of sending money home. I help families in my community get the best GCash and bank transfer rates, and avoid hidden fees.',
    photo: '',
    specialties: ['Philippines Transfers', 'GCash Expert', 'Fee Avoidance', 'Family Remittances'],
    corridors: ['usd-to-php'],
    languages: ['English', 'Tagalog', 'Ilocano'],
    rating: 4.9,
    reviewCount: 81,
    tier: 'pro',
    contactEmail: 'grace@example.com',
    location: 'San Francisco, CA',
    yearsExperience: 7,
    verified: true,
  },
]

/**
 * Get advisors for a specific corridor.
 */
export function getAdvisorsForCorridor(corridorSlug: string): Advisor[] {
  return MOCK_ADVISORS
    .filter((a) => a.corridors.includes(corridorSlug))
    .sort((a, b) => {
      // Premium first, then pro, then basic
      const tierOrder = { premium: 0, pro: 1, basic: 2 }
      return tierOrder[a.tier] - tierOrder[b.tier]
    })
}

/**
 * Get all advisors sorted by tier then rating.
 */
export function getAllAdvisors(): Advisor[] {
  return [...MOCK_ADVISORS].sort((a, b) => {
    const tierOrder = { premium: 0, pro: 1, basic: 2 }
    const tierDiff = tierOrder[a.tier] - tierOrder[b.tier]
    if (tierDiff !== 0) return tierDiff
    return b.rating - a.rating
  })
}
