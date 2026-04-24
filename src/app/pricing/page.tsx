import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, Zap, ArrowRight, Star } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { PRICING_PLANS, API_TIERS, ADDITIONAL_REVENUE_STREAMS } from '@/lib/business-model'

export const metadata: Metadata = {
  title: 'Pricing — Free, Pro & Business Plans | 1StopRemittance',
  description: 'Start free. Upgrade for unlimited rate alerts, 90-day history, best-time-to-send predictions, and API access. Plans from $4.99/month.',
  keywords: 'remittance rate alerts subscription, best rate notifications, money transfer alerts, remittance API pricing, free money transfer comparison',
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ')
}

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="bg-gray-950 text-white min-h-screen pt-24 pb-20">
        {/* Hero */}
        <section className="relative py-16 text-center overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[400px] w-[600px] rounded-full bg-emerald-500/15 blur-[120px]" />
          </div>
          <div className="relative z-10 mx-auto max-w-3xl px-6">
            <span className="inline-block mb-4 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-medium text-emerald-400">
              Simple, Transparent Pricing
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              Save More on Every Transfer
            </h1>
            <p className="mt-4 text-lg text-gray-400">
              Rate comparison is always free. Upgrade to Pro for unlimited alerts, rate predictions,
              and a history that pays for itself with one well-timed transfer.
            </p>
          </div>
        </section>

        {/* Consumer Plans */}
        <section className="mx-auto max-w-5xl px-6 lg:px-8 pb-20">
          <div className="grid gap-6 md:grid-cols-3">
            {PRICING_PLANS.map((plan) => (
              <div
                key={plan.id}
                className={cn(
                  'relative rounded-2xl border p-7 flex flex-col',
                  plan.highlighted
                    ? 'border-emerald-400/50 bg-gradient-to-b from-emerald-500/10 to-gray-900/70 shadow-lg shadow-emerald-500/10'
                    : 'border-white/10 bg-gray-900/50',
                )}
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 px-4 py-0.5 text-xs font-bold text-gray-950">
                    {plan.badge}
                  </span>
                )}

                <div className="mb-5">
                  <h2 className="text-xl font-bold text-white">{plan.name}</h2>
                  <p className="text-sm text-gray-400 mt-1">{plan.description}</p>
                </div>

                <div className="mb-6">
                  {plan.price === 0 ? (
                    <p className="text-4xl font-extrabold text-white">Free</p>
                  ) : (
                    <div>
                      <p className="text-4xl font-extrabold text-white">
                        ${plan.priceAnnual}
                        <span className="text-base font-normal text-gray-400">/mo</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Billed annually · ${plan.price}/mo month-to-month
                      </p>
                    </div>
                  )}
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-gray-300">
                      <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.id === 'free' ? '/compare' : '/pricing/checkout?plan=' + plan.id}
                  className={cn(
                    'flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90',
                    plan.highlighted
                      ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-950'
                      : 'border border-white/20 text-white hover:bg-white/5',
                  )}
                >
                  {plan.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>

          {/* Savings callout */}
          <div className="mt-8 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-5 text-center">
            <p className="text-sm text-gray-300">
              <Star className="inline h-4 w-4 text-yellow-400 mr-1" />
              <strong className="text-white">Pro pays for itself:</strong> Sending $1,000/month when
              the rate is 0.5% better saves ~$60/year — vs $48/year for Pro.
              <span className="text-emerald-400 font-medium"> Net gain: $12+/year.</span>
            </p>
          </div>
        </section>

        {/* API / White-label Section */}
        <section className="border-t border-white/10 py-20">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="inline-block mb-4 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 text-xs font-medium text-cyan-400">
                For Businesses & Developers
              </span>
              <h2 className="text-3xl font-bold text-white">White-Label API & Widget</h2>
              <p className="mt-4 text-gray-400 max-w-xl mx-auto">
                Power your app, neobank, or credit union with live remittance rates. Embed our comparison
                widget under your brand in minutes.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {API_TIERS.map((tier) => (
                <div
                  key={tier.id}
                  className={cn(
                    'rounded-2xl border p-6 flex flex-col',
                    tier.id === 'growth'
                      ? 'border-cyan-400/40 bg-cyan-500/5'
                      : 'border-white/10 bg-gray-900/50',
                  )}
                >
                  <h3 className="text-lg font-bold text-white mb-1">{tier.name}</h3>
                  <p className="text-xs text-gray-500 mb-4">{tier.targetCustomer}</p>

                  <div className="mb-5">
                    {tier.monthlyUsd === 0 ? (
                      <p className="text-2xl font-extrabold text-white">Custom</p>
                    ) : (
                      <p className="text-2xl font-extrabold text-white">
                        ${tier.monthlyUsd}
                        <span className="text-sm font-normal text-gray-400">/mo</span>
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {tier.callsPerMonth === 'unlimited'
                        ? 'Unlimited API calls'
                        : `${tier.callsPerMonth.toLocaleString()} calls/month`}
                    </p>
                  </div>

                  <ul className="space-y-2.5 mb-6 flex-1">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs text-gray-300">
                        <Zap className="h-3.5 w-3.5 text-cyan-400 mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={tier.id === 'enterprise' ? '/api-access#contact' : '/api-access'}
                    className="flex items-center justify-center gap-2 rounded-xl border border-cyan-400/30 px-5 py-2.5 text-sm font-semibold text-cyan-400 hover:bg-cyan-400/10 transition-colors"
                  >
                    {tier.id === 'enterprise' ? 'Contact Sales' : 'Get API Access'}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Revenue transparency */}
        <section className="border-t border-white/10 py-20">
          <div className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">How We Make Money</h2>
            <p className="text-gray-400 mb-8">
              We are a comparison platform. Our revenue never influences the rates we show you.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 text-left">
              {[
                {
                  emoji: '🔗',
                  title: 'Affiliate Commissions',
                  desc: 'We earn $8–$25 when you click through to a provider and complete a transfer. Rates shown are always live and unaffected.',
                },
                {
                  emoji: '⭐',
                  title: 'Premium Subscriptions',
                  desc: 'Pro and Business subscribers pay for advanced features: unlimited alerts, rate history, and API access.',
                },
                {
                  emoji: '📌',
                  title: 'Featured Placements',
                  desc: 'Providers can pay to appear first (clearly labeled "Sponsored"). The actual rates shown are always accurate.',
                },
                {
                  emoji: '🔌',
                  title: 'White-Label API',
                  desc: 'Banks and fintechs pay to embed our rate engine in their apps under their brand.',
                },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-white/10 bg-gray-900/50 p-4">
                  <p className="text-2xl mb-2">{item.emoji}</p>
                  <p className="text-sm font-semibold text-white mb-1">{item.title}</p>
                  <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Additional streams teaser */}
            <div className="mt-10 text-left">
              <p className="text-sm font-semibold text-gray-300 mb-4">
                More revenue streams in development:
              </p>
              <div className="space-y-2">
                {ADDITIONAL_REVENUE_STREAMS.slice(0, 3).map((stream) => (
                  <div key={stream.id} className="flex items-start gap-3 text-xs text-gray-400">
                    <span className="text-emerald-400 mt-0.5">→</span>
                    <span>
                      <strong className="text-gray-300">{stream.name}</strong> — {stream.description.slice(0, 100)}...
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
