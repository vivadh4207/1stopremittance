import type { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { RateAlertForm } from '@/components/rate-alert-form'
import { TrendingUp, Mail, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Free Rate Alerts — Get Notified When Rates Move',
  description:
    'Set a target rate for your remittance corridor (e.g., USD → NGN at 1,600) and we will email you the moment the live market rate hits it. Free, unsubscribe anytime.',
  alternates: { canonical: 'https://1stopremittance.com/rate-alerts' },
  keywords:
    'rate alerts, fx alerts, USD NGN alert, exchange rate notification, remittance rate tracker',
}

const BENEFITS = [
  {
    icon: TrendingUp,
    title: 'Time the market',
    body: 'Pick your target rate and we watch it for you — 24/7, across every supported corridor.',
  },
  {
    icon: Mail,
    title: 'One clean email',
    body: 'No spam. Just one email the moment your target hits, with a direct link to the cheapest provider.',
  },
  {
    icon: Zap,
    title: 'One-click unsubscribe',
    body: 'You own your inbox. Every alert email has a one-click unsubscribe — no login required.',
  },
]

export default function RateAlertsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-950 pt-28 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block mb-4 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-medium text-emerald-400">
              Free Tool
            </span>
            <h1 className="text-4xl font-bold text-white sm:text-5xl mb-4">
              Get{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Rate Alerts
              </span>{' '}
              for Your Corridor
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Pick a target — say 1 USD = 1,600 NGN — and we&apos;ll email you the moment the market rate reaches it. Free, no account needed.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.3fr,1fr]">
            <RateAlertForm defaultFrom="USD" defaultTo="NGN" />

            <div className="space-y-4">
              {BENEFITS.map((b) => (
                <div
                  key={b.title}
                  className="rounded-2xl border border-white/10 bg-gray-900/60 p-6"
                >
                  <b.icon className="h-6 w-6 text-emerald-400 mb-3" />
                  <h3 className="text-white font-semibold mb-1">{b.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{b.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
