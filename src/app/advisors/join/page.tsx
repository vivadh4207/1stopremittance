'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { SUBSCRIPTION_TIERS } from '@/lib/advisors'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import {
  Check,
  Star,
  Users,
  TrendingUp,
  Shield,
  ArrowRight,
  Crown,
  Award,
} from 'lucide-react'

export default function AdvisorJoinPage() {
  const [selectedTier, setSelectedTier] = useState('pro')
  const [formSubmitted, setFormSubmitted] = useState(false)

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-950 pt-28 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16">
            <span className="inline-block mb-4 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-medium text-emerald-400">
              Grow Your Business
            </span>
            <h1 className="text-4xl font-bold text-white sm:text-5xl mb-6">
              Become a Listed{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Advisor
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Reach thousands of Nigerian and Filipino diaspora members actively looking for expert remittance guidance. Generate leads while you sleep.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
            {[
              { value: '50K+', label: 'Monthly visitors', icon: Users },
              { value: '8+', label: 'Corridors covered', icon: TrendingUp },
              { value: '4.8★', label: 'Average rating', icon: Star },
              { value: '100%', label: 'Verified advisors', icon: Shield },
            ].map((s) => (
              <div key={s.label} className="bg-gray-900/50 border border-white/10 rounded-2xl p-5 text-center">
                <s.icon className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="text-xs text-gray-400">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Pricing tiers */}
          <h2 className="text-2xl font-bold text-white text-center mb-8">Choose Your Plan</h2>
          <div className="grid gap-6 sm:grid-cols-3 mb-16">
            {SUBSCRIPTION_TIERS.map((tier) => (
              <div
                key={tier.id}
                onClick={() => setSelectedTier(tier.id)}
                className={cn(
                  'relative cursor-pointer bg-gray-900/50 border rounded-2xl p-6 transition-all',
                  selectedTier === tier.id
                    ? 'border-emerald-400/50 ring-1 ring-emerald-400/30'
                    : 'border-white/10 hover:border-white/20',
                  tier.popular && 'sm:-mt-4 sm:mb-4'
                )}
              >
                {tier.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900 px-4 py-0.5 rounded-full text-xs font-bold">
                    Most Popular
                  </span>
                )}

                <div className="flex items-center gap-2 mb-4">
                  {tier.id === 'premium' ? (
                    <Crown className="h-5 w-5 text-emerald-400" />
                  ) : tier.id === 'pro' ? (
                    <Award className="h-5 w-5 text-cyan-400" />
                  ) : (
                    <Shield className="h-5 w-5 text-gray-400" />
                  )}
                  <h3 className="text-lg font-bold text-white">{tier.name}</h3>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">${tier.price}</span>
                  <span className="text-gray-400 text-sm">/{tier.interval}</span>
                </div>

                <ul className="space-y-3 mb-6">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                      <Check className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={cn(
                    'w-full py-3 rounded-xl font-bold text-sm transition-all',
                    selectedTier === tier.id
                      ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900'
                      : 'bg-white/10 text-white hover:bg-white/15'
                  )}
                >
                  {tier.cta}
                </button>
              </div>
            ))}
          </div>

          {/* Signup form */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-900/50 border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-2">Apply to Join</h2>
              <p className="text-gray-400 text-sm mb-6">
                Fill out the form below and we&apos;ll review your application within 24 hours.
                Selected plan: <span className="text-emerald-400 font-semibold capitalize">{selectedTier}</span> (${SUBSCRIPTION_TIERS.find((t) => t.id === selectedTier)?.price}/mo)
              </p>

              {formSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-emerald-400/20 flex items-center justify-center mx-auto mb-4">
                    <Check className="h-8 w-8 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Application Received!</h3>
                  <p className="text-gray-400">We&apos;ll review your application and get back to you within 24 hours.</p>
                  <Link href="/advisors" className="inline-flex items-center gap-2 mt-6 text-emerald-400 hover:text-emerald-300 text-sm font-medium">
                    View Advisor Directory <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setFormSubmitted(true) }} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Full Name *</label>
                      <input
                        required
                        type="text"
                        placeholder="John Doe"
                        className="w-full rounded-xl border border-white/10 bg-gray-800/60 px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-emerald-400/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Email *</label>
                      <input
                        required
                        type="email"
                        placeholder="john@example.com"
                        className="w-full rounded-xl border border-white/10 bg-gray-800/60 px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-emerald-400/50"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Professional Title *</label>
                      <input
                        required
                        type="text"
                        placeholder="Remittance Advisor"
                        className="w-full rounded-xl border border-white/10 bg-gray-800/60 px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-emerald-400/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Location *</label>
                      <input
                        required
                        type="text"
                        placeholder="Houston, TX"
                        className="w-full rounded-xl border border-white/10 bg-gray-800/60 px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-emerald-400/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Corridors You Specialize In *</label>
                    <div className="flex flex-wrap gap-2">
                      {['🇳🇬 Nigeria', '🇵🇭 Philippines', '🇬🇭 Ghana', '🇰🇪 Kenya', '🇲🇽 Mexico', '🇮🇳 India', '🇵🇰 Pakistan'].map((c) => (
                        <label key={c} className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                          <input type="checkbox" className="accent-emerald-400" />
                          <span className="text-sm text-gray-300">{c}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Years of Experience *</label>
                    <input
                      required
                      type="number"
                      min="1"
                      placeholder="5"
                      className="w-full rounded-xl border border-white/10 bg-gray-800/60 px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-emerald-400/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Tell Us About Yourself *</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Describe your experience helping diaspora communities with remittances..."
                      className="w-full rounded-xl border border-white/10 bg-gray-800/60 px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-emerald-400/50 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Website (optional)</label>
                    <input
                      type="url"
                      placeholder="https://yourwebsite.com"
                      className="w-full rounded-xl border border-white/10 bg-gray-800/60 px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-emerald-400/50"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900 font-bold rounded-xl text-sm hover:opacity-90 transition-opacity"
                  >
                    Submit Application — {selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1)} Plan (${SUBSCRIPTION_TIERS.find((t) => t.id === selectedTier)?.price}/mo)
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    You won&apos;t be charged until your application is approved. Cancel anytime.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
