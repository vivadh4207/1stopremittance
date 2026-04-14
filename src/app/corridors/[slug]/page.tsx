'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { generateProviderRates, CURRENCIES } from '@/lib/constants'
import { useRates } from '@/hooks/use-rates'
import { getAdvisorsForCorridor, type Advisor } from '@/lib/advisors'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import {
  ArrowRight,
  Star,
  Clock,
  TrendingUp,
  ChevronRight,
  Building2,
  Smartphone,
  Banknote,
  Lightbulb,
  Mail,
  BadgeCheck,
  MapPin,
  Crown,
  Award,
} from 'lucide-react'

const CORRIDOR_DATA: Record<string, {
  from: string; to: string; fromName: string; toName: string
  fromFlag: string; toFlag: string; fromSymbol: string; toSymbol: string
  title: string; description: string
  tips: { title: string; text: string }[]
  bankInfo: string
  deliveryMethods: string[]
}> = {
  'usd-to-ngn': {
    from: 'USD', to: 'NGN', fromName: 'US Dollar', toName: 'Nigerian Naira',
    fromFlag: '🇺🇸', toFlag: '🇳🇬', fromSymbol: '$', toSymbol: '₦',
    title: 'Send Money from USA to Nigeria',
    description: 'Nigeria receives over $20 billion in remittances annually, making it the largest recipient in Africa. Whether you are sending to family in Lagos, Abuja, or anywhere else, comparing providers can save you thousands of naira on every transfer.',
    tips: [
      { title: 'Watch the NGN parallel market rate', text: 'The official CBN rate and the parallel market rate can differ significantly. Some providers offer rates closer to the parallel market, giving your recipient more naira.' },
      { title: 'Send larger amounts less frequently', text: 'Most providers charge lower fees on larger transfers. Instead of sending $100 weekly, consider sending $400 monthly to save on fees.' },
      { title: 'Use bank transfer instead of cards', text: 'Paying by bank transfer (ACH) is usually free or very cheap. Credit card payments often add 2-4% in fees.' },
      { title: 'Set up rate alerts', text: 'The NGN rate fluctuates daily. Sign up for rate alerts to send when the rate is most favorable for your recipient.' },
    ],
    bankInfo: 'Popular Nigerian banks: GTBank (Guaranty Trust), Zenith Bank, Access Bank, First Bank of Nigeria, UBA (United Bank for Africa), Fidelity Bank',
    deliveryMethods: ['Bank Transfer', 'Mobile Money', 'Cash Pickup', 'Airtime Top-up'],
  },
  'usd-to-php': {
    from: 'USD', to: 'PHP', fromName: 'US Dollar', toName: 'Philippine Peso',
    fromFlag: '🇺🇸', toFlag: '🇵🇭', fromSymbol: '$', toSymbol: '₱',
    title: 'Send Money from USA to Philippines',
    description: 'The Philippines is one of the top remittance-receiving countries in the world, with over $36 billion received annually. Filipino Americans (Balikbayan) send billions home to support families across Luzon, Visayas, and Mindanao.',
    tips: [
      { title: 'Compare GCash vs bank deposit rates', text: 'Some providers offer better rates for GCash delivery than bank deposits. GCash is also instant, making it ideal for urgent transfers.' },
      { title: 'Take advantage of Balikbayan promotions', text: 'Providers like Remitly and WorldRemit frequently run promotions for Filipino corridors. Check for promo codes before sending.' },
      { title: 'Consider peso cost averaging', text: 'If you send regularly, the PHP rate varies. Sending at a fixed schedule averages out rate fluctuations over time.' },
      { title: 'Use provider apps for better rates', text: 'Many providers offer slightly better rates on their mobile apps compared to their websites. Download the app for your chosen provider.' },
    ],
    bankInfo: 'Popular Philippine banks: BDO Unibank, BPI (Bank of the Philippine Islands), Metrobank, Landbank, PNB (Philippine National Bank). Digital wallets: GCash, Maya (PayMaya)',
    deliveryMethods: ['Bank Transfer', 'GCash', 'Cash Pickup', 'Door-to-Door'],
  },
  'usd-to-inr': {
    from: 'USD', to: 'INR', fromName: 'US Dollar', toName: 'Indian Rupee',
    fromFlag: '🇺🇸', toFlag: '🇮🇳', fromSymbol: '$', toSymbol: '₹',
    title: 'Send Money from USA to India',
    description: 'India is the world\'s largest remittance recipient, receiving over $100 billion annually. Indian Americans send money home for family support, investments, and celebrations.',
    tips: [
      { title: 'Use UPI-linked transfers', text: 'Some providers now support direct UPI transfers, which are instant and often have lower fees than traditional bank deposits.' },
      { title: 'Compare rates for large amounts', text: 'For amounts over $1,000, the rate difference between providers can mean thousands of rupees more for your recipient.' },
      { title: 'Time your transfers', text: 'INR rates tend to be more favorable during US business hours. Avoid sending on Indian bank holidays.' },
      { title: 'Check NRE vs NRO account options', text: 'If you have an NRE account, some providers can transfer directly to it with tax-free benefits.' },
    ],
    bankInfo: 'Popular Indian banks: SBI (State Bank of India), HDFC Bank, ICICI Bank, Axis Bank, Punjab National Bank, Bank of Baroda',
    deliveryMethods: ['Bank Transfer', 'UPI', 'Cash Pickup'],
  },
  'usd-to-ghs': {
    from: 'USD', to: 'GHS', fromName: 'US Dollar', toName: 'Ghanaian Cedi',
    fromFlag: '🇺🇸', toFlag: '🇬🇭', fromSymbol: '$', toSymbol: '₵',
    title: 'Send Money from USA to Ghana',
    description: 'Ghana receives over $4 billion in remittances annually. The Ghanaian diaspora in the US plays a crucial role in supporting families and investing back home.',
    tips: [
      { title: 'Mobile Money is king', text: 'MTN Mobile Money (MoMo) is the most popular digital payment method in Ghana. Many providers offer instant delivery to MoMo.' },
      { title: 'Watch the cedi volatility', text: 'GHS has experienced significant depreciation. Set up rate alerts to send when the rate is favorable.' },
      { title: 'Compare cash pickup options', text: 'If your recipient doesn\'t have a bank account, compare cash pickup fees across providers.' },
      { title: 'Check for first-time bonuses', text: 'Many providers offer zero-fee first transfers to Ghana. Take advantage of these promotions.' },
    ],
    bankInfo: 'Popular Ghanaian banks: GCB Bank, Ecobank Ghana, Stanbic Bank, Fidelity Bank Ghana. Mobile Money: MTN MoMo, Vodafone Cash, AirtelTigo Money',
    deliveryMethods: ['Bank Transfer', 'Mobile Money (MTN MoMo)', 'Cash Pickup'],
  },
  'usd-to-mxn': {
    from: 'USD', to: 'MXN', fromName: 'US Dollar', toName: 'Mexican Peso',
    fromFlag: '🇺🇸', toFlag: '🇲🇽', fromSymbol: '$', toSymbol: '$',
    title: 'Send Money from USA to Mexico',
    description: 'Mexico receives over $60 billion in remittances annually, primarily from the United States. It is the second-largest remittance corridor in the world.',
    tips: [
      { title: 'Same-day delivery is common', text: 'Many providers offer same-day or instant delivery to Mexican bank accounts and cash pickup locations.' },
      { title: 'Compare SPEI vs cash pickup', text: 'SPEI bank transfers are usually cheaper than cash pickup. If your recipient has a bank account, choose SPEI.' },
      { title: 'Watch for peso strength', text: 'MXN has been relatively strong recently. Compare rates frequently as small differences add up.' },
      { title: 'Use debit card for lower fees', text: 'Avoid credit cards. Debit card and bank transfers typically have the lowest fees for Mexico transfers.' },
    ],
    bankInfo: 'Popular Mexican banks: BBVA Mexico, Banorte, Santander Mexico, Citibanamex, HSBC Mexico. Digital: Mercado Pago, OXXO (cash pickup)',
    deliveryMethods: ['Bank Transfer (SPEI)', 'Cash Pickup (OXXO)', 'Mobile Wallet'],
  },
  'usd-to-kes': {
    from: 'USD', to: 'KES', fromName: 'US Dollar', toName: 'Kenyan Shilling',
    fromFlag: '🇺🇸', toFlag: '🇰🇪', fromSymbol: '$', toSymbol: 'KSh',
    title: 'Send Money from USA to Kenya',
    description: 'Kenya is a leading remittance destination in East Africa, receiving over $4 billion annually. M-Pesa dominates the mobile money landscape.',
    tips: [
      { title: 'M-Pesa is fastest', text: 'Send directly to M-Pesa for instant delivery. Most providers support M-Pesa transfers to Kenya.' },
      { title: 'Compare M-Pesa rates carefully', text: 'Different providers apply different markups on M-Pesa transfers. The rate difference can be significant.' },
      { title: 'Bundle transfers', text: 'Send larger amounts less frequently to minimize per-transaction fees.' },
      { title: 'Check Sendwave for Africa', text: 'Sendwave specializes in African corridors and often has competitive rates for Kenya.' },
    ],
    bankInfo: 'Popular Kenyan banks: Equity Bank, KCB Bank, Co-operative Bank, NCBA. Mobile Money: M-Pesa (Safaricom), Airtel Money',
    deliveryMethods: ['M-Pesa', 'Bank Transfer', 'Cash Pickup'],
  },
  'usd-to-pkr': {
    from: 'USD', to: 'PKR', fromName: 'US Dollar', toName: 'Pakistani Rupee',
    fromFlag: '🇺🇸', toFlag: '🇵🇰', fromSymbol: '$', toSymbol: '₨',
    title: 'Send Money from USA to Pakistan',
    description: 'Pakistan receives over $30 billion in remittances annually, making it one of the top recipients globally.',
    tips: [
      { title: 'Compare open market vs official rate', text: 'Some providers offer rates closer to the open market rate, which can mean significantly more rupees.' },
      { title: 'JazzCash and Easypaisa options', text: 'Mobile wallet delivery via JazzCash or Easypaisa is instant and widely accessible in Pakistan.' },
      { title: 'Bank transfer is cheapest', text: 'Paying via ACH bank transfer from your US bank account usually has the lowest fees.' },
      { title: 'Verify recipient details carefully', text: 'Ensure the IBAN and account details are correct to avoid delays or returned transfers.' },
    ],
    bankInfo: 'Popular Pakistani banks: HBL, UBL, MCB, Allied Bank, Bank Alfalah. Mobile wallets: JazzCash, Easypaisa',
    deliveryMethods: ['Bank Transfer', 'JazzCash', 'Easypaisa', 'Cash Pickup'],
  },
  'usd-to-bdt': {
    from: 'USD', to: 'BDT', fromName: 'US Dollar', toName: 'Bangladeshi Taka',
    fromFlag: '🇺🇸', toFlag: '🇧🇩', fromSymbol: '$', toSymbol: '৳',
    title: 'Send Money from USA to Bangladesh',
    description: 'Bangladesh receives over $21 billion in remittances annually, a critical lifeline for millions of families.',
    tips: [
      { title: 'bKash is widely used', text: 'bKash is the dominant mobile wallet in Bangladesh. Many providers offer instant bKash delivery.' },
      { title: 'Compare rates on larger amounts', text: 'For amounts over $500, rate differences between providers can save your recipient thousands of taka.' },
      { title: 'Government incentive on remittances', text: 'The Bangladesh government offers a 2.5% cash incentive on inward remittances through official channels.' },
      { title: 'Avoid informal channels', text: 'Always use licensed providers. Informal channels (hundi) are illegal and risky.' },
    ],
    bankInfo: 'Popular Bangladeshi banks: Islami Bank Bangladesh, BRAC Bank, Dutch-Bangla Bank, Eastern Bank. Mobile wallets: bKash, Nagad, Rocket',
    deliveryMethods: ['Bank Transfer', 'bKash', 'Nagad', 'Cash Pickup'],
  },
}

export default function CorridorDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const corridor = CORRIDOR_DATA[slug]
  const [amount, setAmount] = useState(1000)

  if (!corridor) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-950 pt-28 pb-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Corridor Not Found</h1>
            <p className="text-gray-400 mb-8">This corridor is not yet available.</p>
            <Link href="/corridors" className="text-emerald-400 hover:text-emerald-300">
              ← Back to all corridors
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  // Fetch live rates
  const { data: rateData, source, lastUpdated } = useRates({
    from: corridor.from,
    to: corridor.to,
    amount,
  })
  // Use live providers if available, fallback to static
  const providers = rateData?.providers && rateData.providers.length > 0
    ? rateData.providers
    : generateProviderRates(amount, corridor.from, corridor.to)
  const toCurrency = CURRENCIES.find((c) => c.code === corridor.to)

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-950 pt-28 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-gray-300">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/corridors" className="hover:text-gray-300">Corridors</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-gray-300">{corridor.from} to {corridor.to}</span>
          </nav>

          {/* Hero */}
          <div className="bg-gray-900/50 border border-white/10 rounded-3xl p-8 mb-10">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-5xl">{corridor.fromFlag}</span>
              <ArrowRight className="h-6 w-6 text-emerald-400" />
              <span className="text-5xl">{corridor.toFlag}</span>
            </div>
            <h1 className="text-3xl font-bold text-white sm:text-4xl mb-4">{corridor.title}</h1>
            <p className="text-gray-400 leading-relaxed max-w-3xl">{corridor.description}</p>
          </div>

          {/* Amount input */}
          <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-6 mb-8">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs text-gray-400 font-medium mb-1">You send</label>
                <div className="flex items-center gap-2 bg-gray-800/60 border border-white/10 rounded-xl px-4 py-3">
                  <span className="text-gray-400">{corridor.fromSymbol}</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(+e.target.value || 0)}
                    className="flex-1 bg-transparent text-lg font-bold text-white outline-none"
                  />
                  <span className="text-sm text-gray-400">{corridor.from}</span>
                </div>
              </div>
              <div className="text-sm text-gray-400 self-end pb-3 flex items-center gap-2">
                Comparing 8 providers for {corridor.from} → {corridor.to}
                {source && source !== 'fallback' && (
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Provider cards */}
          <div className="space-y-3 mb-12">
            {providers.map((p, i) => (
              <div
                key={p.id}
                className={cn(
                  'bg-gray-900/50 border rounded-2xl p-5 transition-colors hover:bg-gray-900/80',
                  i === 0 ? 'border-emerald-400/30' : 'border-white/10'
                )}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex items-center gap-4 min-w-[180px]">
                    <div className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold',
                      i === 0 ? 'bg-emerald-400/20 text-emerald-400' : 'bg-white/5 text-gray-400'
                    )}>
                      {i === 0 ? '👑' : `#${i + 1}`}
                    </div>
                    <span className="text-3xl">{p.logo}</span>
                    <div>
                      <div className="text-white font-bold">{p.name}</div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-yellow-400 text-xs">{p.rating}</span>
                        <span className="text-gray-500 text-xs">({p.reviews})</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
                    <div>
                      <div className="text-xs text-gray-400">Rate</div>
                      <div className="text-white font-semibold">{p.rate.toFixed(4)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Fee</div>
                      <div className="text-white font-semibold">${p.fee}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Speed</div>
                      <div className="text-white font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3 text-cyan-400" /> {p.speed}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Recipient gets</div>
                      <div className={cn('text-lg font-bold', i === 0 ? 'text-emerald-400' : 'text-white')}>
                        {toCurrency?.symbol}{p.received.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap',
                      i === 0
                        ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900 hover:shadow-lg hover:shadow-emerald-400/25'
                        : 'bg-white/10 text-white hover:bg-white/15'
                    )}
                  >
                    {i === 0 ? 'Best Deal →' : 'Send →'}
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Tips */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Lightbulb className="h-6 w-6 text-emerald-400" />
              Tips for {corridor.title.replace('Send Money from ', 'Sending to ').replace('USA to ', '')}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {corridor.tips.map((tip) => (
                <div key={tip.title} className="bg-gray-900/50 border border-white/10 rounded-2xl p-6">
                  <h3 className="text-white font-semibold mb-2">{tip.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{tip.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bank info */}
          <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-6 mb-12">
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
              <Building2 className="h-5 w-5 text-emerald-400" />
              Popular Banks & Wallets
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">{corridor.bankInfo}</p>
          </div>

          {/* Delivery methods */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-emerald-400" />
              Available Delivery Methods
            </h2>
            <div className="flex flex-wrap gap-3">
              {corridor.deliveryMethods.map((method) => (
                <span key={method} className="px-4 py-2 bg-gray-900/50 border border-white/10 rounded-xl text-sm text-white">
                  {method}
                </span>
              ))}
            </div>
          </div>

          {/* Advisor Section */}
          {(() => {
            const advisors = getAdvisorsForCorridor(slug)
            if (advisors.length === 0) return null
            return (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <BadgeCheck className="h-6 w-6 text-emerald-400" />
                  Expert Advisors for This Corridor
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {advisors.slice(0, 4).map((advisor) => {
                    const initials = advisor.name.split(' ').map((n: string) => n[0]).join('')
                    return (
                      <div key={advisor.id} className={cn(
                        'bg-gray-900/50 border rounded-2xl p-5',
                        advisor.tier === 'premium' ? 'border-emerald-400/30' :
                        advisor.tier === 'pro' ? 'border-cyan-400/20' : 'border-white/10'
                      )}>
                        <div className="flex items-start gap-3 mb-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 text-sm font-bold text-gray-900 flex-shrink-0">
                            {initials}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-white font-bold text-sm truncate">{advisor.name}</span>
                              {advisor.verified && <BadgeCheck className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />}
                              {advisor.tier !== 'basic' && (
                                <span className={cn(
                                  'px-1.5 py-0.5 rounded text-[10px] font-semibold',
                                  advisor.tier === 'premium' ? 'bg-emerald-400/20 text-emerald-400' : 'bg-cyan-400/10 text-cyan-400'
                                )}>
                                  {advisor.tier === 'premium' ? 'Premium' : 'Pro'}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-400">{advisor.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                              <span className="text-xs text-yellow-400">{advisor.rating}</span>
                              <span className="text-xs text-gray-500">· <MapPin className="inline h-3 w-3" /> {advisor.location}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 line-clamp-2 mb-3">{advisor.bio}</p>
                        <a href={`mailto:${advisor.contactEmail}`} className="block w-full text-center py-2 bg-white/10 rounded-lg text-sm text-white font-medium hover:bg-white/15 transition-colors">
                          Contact Advisor
                        </a>
                      </div>
                    )
                  })}
                </div>
                <div className="text-center mt-4">
                  <Link href="/advisors" className="text-sm text-emerald-400 hover:text-emerald-300 font-medium">
                    View all advisors →
                  </Link>
                </div>
              </div>
            )
          })()}

          {/* Email CTA */}
          <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-400/20 rounded-3xl p-8 text-center">
            <Mail className="h-8 w-8 text-emerald-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Get {corridor.from} to {corridor.to} Rate Alerts
            </h2>
            <p className="text-gray-400 mb-6">Get notified when rates are favorable for your corridor.</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-xl border border-white/10 bg-gray-800/60 px-5 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-emerald-400/50"
              />
              <button type="submit" className="px-6 py-3 bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900 font-bold rounded-xl text-sm">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
