import type { Metadata } from 'next'
import Link from 'next/link'
import { Code2, Globe, Zap, Shield, ArrowRight, CheckCircle } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { API_TIERS } from '@/lib/business-model'

export const metadata: Metadata = {
  title: 'Remittance Rate API & White-Label Widget | 1StopRemittance',
  description: 'Embed live remittance rates in your app, bank, or website. REST API with 30+ currency pairs, white-label widget, 99.5% uptime. For fintechs, credit unions, and neobanks.',
  keywords: 'remittance API, exchange rate API, white-label money transfer widget, remittance data API, currency comparison API for banks, fintech remittance integration',
}

const CODE_EXAMPLE = `// Get live rates from all providers
const response = await fetch(
  'https://api.1stopremittance.com/v1/rates?from=USD&to=NGN&amount=1000',
  { headers: { 'X-API-Key': 'your_api_key' } }
)
const data = await response.json()
// → { midMarketRate: 1647.5, providers: [...], bestDeal: {...} }`

export default function ApiAccessPage() {
  return (
    <>
      <Navbar />
      <main className="bg-gray-950 text-white min-h-screen pt-24 pb-20">
        {/* Hero */}
        <section className="relative py-16 overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[120px]" />
            <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-emerald-500/10 blur-[100px]" />
          </div>
          <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-16 lg:grid-cols-2 items-center">
              <div>
                <span className="inline-block mb-4 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 text-xs font-medium text-cyan-400">
                  Developer & B2B API
                </span>
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                  The Remittance Rate API for Builders
                </h1>
                <p className="mt-5 text-lg text-gray-400 leading-relaxed">
                  Embed live, multi-provider remittance rates in your app, neobank, or credit union website.
                  White-label our comparison widget. Power your financial product with the data your
                  diaspora customers need.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href="#tiers"
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 px-7 py-3 text-sm font-semibold text-gray-950 hover:opacity-90 transition-opacity"
                  >
                    View Pricing
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3 text-sm font-semibold text-white hover:bg-white/5 transition-colors"
                  >
                    Talk to Sales
                  </a>
                </div>

                {/* Trust signals */}
                <div className="mt-10 grid grid-cols-3 gap-4">
                  {[
                    { v: '8+', l: 'Providers' },
                    { v: '30+', l: 'Currencies' },
                    { v: '99.5%', l: 'Uptime SLA' },
                  ].map((s) => (
                    <div key={s.l} className="text-center">
                      <p className="text-2xl font-extrabold text-white">{s.v}</p>
                      <p className="text-xs text-gray-500">{s.l}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Code example */}
              <div className="rounded-2xl border border-white/10 bg-gray-900/80 p-6 font-mono text-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="ml-2 text-xs text-gray-500">rates.js</span>
                </div>
                <pre className="text-xs text-gray-300 leading-relaxed whitespace-pre-wrap overflow-x-auto">
                  <code>{CODE_EXAMPLE}</code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 border-t border-white/10">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: Zap, title: 'Live Rates', desc: 'Rates refreshed every 15 minutes from 8+ providers. Sub-200ms response time on Growth tier.' },
                { icon: Globe, title: '30+ Currencies', desc: 'USD, GBP, EUR, NGN, PHP, INR, GHS, KES, MXN, PKR, BDT, CAD and growing.' },
                { icon: Code2, title: 'REST + Webhooks', desc: 'Clean JSON REST API with webhook support for real-time rate change notifications.' },
                { icon: Shield, title: 'Enterprise-grade', desc: '99.99% uptime SLA on Enterprise. TLS 1.3, key rotation, audit logs included.' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-gray-900/50 p-5">
                  <div className="h-10 w-10 rounded-xl bg-cyan-400/10 flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5 text-cyan-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-2">{title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* API Tiers */}
        <section id="tiers" className="py-16 border-t border-white/10">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white">API Pricing</h2>
              <p className="mt-3 text-gray-400">Annual billing saves 20% on all plans.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {API_TIERS.map((tier) => (
                <div
                  key={tier.id}
                  className={`rounded-2xl border p-6 flex flex-col ${
                    tier.id === 'growth'
                      ? 'border-cyan-400/40 bg-cyan-500/5'
                      : 'border-white/10 bg-gray-900/50'
                  }`}
                >
                  <h3 className="text-lg font-bold text-white">{tier.name}</h3>
                  <p className="text-xs text-gray-500 mt-1 mb-4">{tier.targetCustomer}</p>
                  <div className="mb-4">
                    {tier.monthlyUsd === 0 ? (
                      <p className="text-2xl font-extrabold text-white">Custom</p>
                    ) : (
                      <p className="text-2xl font-extrabold text-white">
                        ${tier.monthlyUsd}<span className="text-sm font-normal text-gray-400">/mo</span>
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">{tier.sla} · {
                      tier.callsPerMonth === 'unlimited'
                        ? 'Unlimited calls'
                        : `${(tier.callsPerMonth as number).toLocaleString()} calls/mo`
                    }</p>
                  </div>
                  <ul className="space-y-2 flex-1 mb-5">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs text-gray-300">
                        <CheckCircle className="h-3.5 w-3.5 text-cyan-400 mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={tier.id === 'enterprise' ? '#contact' : '/pricing'}
                    className="flex items-center justify-center gap-2 rounded-xl border border-cyan-400/30 px-5 py-2.5 text-sm font-semibold text-cyan-400 hover:bg-cyan-400/10 transition-colors"
                  >
                    {tier.id === 'enterprise' ? 'Contact Sales' : 'Get Started'}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact sales */}
        <section id="contact" className="py-16 border-t border-white/10">
          <div className="mx-auto max-w-2xl px-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">Talk to Our Team</h2>
            <p className="text-gray-400 mb-8">
              Enterprise pricing, custom corridor coverage, co-branded integrations, or revenue share
              partnerships — our team can put together a custom deal.
            </p>
            <a
              href="mailto:api@1stopremittance.com?subject=API%20%2F%20White-label%20Inquiry"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 px-8 py-3.5 text-sm font-bold text-gray-950 hover:opacity-90 transition-opacity"
            >
              Email api@1stopremittance.com
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
