import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Shield, Clock, CheckCircle, Star } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { LEGAL_PRODUCTS, LEGAL_DISCLAIMER } from '@/lib/legal-services'

export const metadata: Metadata = {
  title: 'Business Formation & Document Services | 1StopRemittance',
  description: 'Form an LLC, get an EIN, register a trademark, and more. Professional document preparation services starting at $49. Not a law firm — public information only.',
  keywords: [
    'LLC formation service',
    'form LLC online cheap',
    'EIN application online',
    'business registration service',
    'LegalZoom alternative',
    'ZenBusiness alternative',
    'cheap LLC formation',
    'trademark registration online',
    'registered agent service',
    'annual report filing',
    'DBA filing',
    'ITIN application',
    'immigrant business formation',
    'diaspora business services',
  ].join(', '),
  openGraph: {
    title: 'Business Formation & Document Services | 1StopRemittance',
    description: 'Form an LLC, get an EIN, register a trademark. Affordable document preparation services for diaspora entrepreneurs.',
    type: 'website',
  },
}

export default function LegalServicesPage() {
  const byCategory: Record<string, typeof LEGAL_PRODUCTS> = {}
  for (const product of LEGAL_PRODUCTS) {
    if (!byCategory[product.category]) byCategory[product.category] = []
    byCategory[product.category].push(product)
  }

  const categoryLabels: Record<string, string> = {
    'business-formation': '🏢 Business Formation',
    'tax-ids': '🔢 Tax IDs & Numbers',
    'compliance': '📋 Compliance & Annual Filings',
    'intellectual-property': '™️ Intellectual Property',
    'registered-agent': '📬 Registered Agent',
    'immigration': '🌎 Immigration & Tax Status',
  }

  return (
    <>
      <Navbar />
      <main className="bg-gray-950 text-white min-h-screen">
        {/* Hero */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-emerald-500/15 blur-[128px]" />
            <div className="absolute top-1/3 right-0 h-[400px] w-[400px] rounded-full bg-cyan-500/15 blur-[128px]" />
          </div>
          <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 text-center">
            <span className="inline-block mb-4 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-medium text-emerald-400">
              Document Preparation Services
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Start &amp; Grow Your{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Business
              </span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-400">
              Professional document preparation for LLCs, EINs, trademarks, and more.
              We use official government forms and public information — affordable alternatives
              to expensive attorney fees for straightforward filings.
            </p>
            <div className="mt-4 max-w-xl mx-auto rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-xs text-yellow-300 text-left">
              ⚖️ <strong>Disclaimer:</strong> {LEGAL_DISCLAIMER.slice(0, 120)}...{' '}
              <Link href="/about" className="underline">Learn more</Link>
            </div>

            {/* Trust badges */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-400" />
                <span>Secure & Encrypted</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-emerald-400" />
                <span>Fast Processing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span>Official Gov Forms Only</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-400" />
                <span>4.8/5 Customer Rating</span>
              </div>
            </div>
          </div>
        </section>

        {/* Products by Category */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            {Object.entries(byCategory).map(([cat, products]) => (
              <div key={cat} className="mb-16">
                <h2 className="text-2xl font-bold mb-8 text-white">
                  {categoryLabels[cat] || cat}
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {products.map((product) => (
                    <Link
                      key={product.id}
                      href={`/legal-services/${product.slug}`}
                      className="group relative block rounded-2xl border border-white/10 bg-gray-900/50 p-6 hover:border-emerald-400/40 transition-all hover:bg-gray-900/70 backdrop-blur-xl"
                    >
                      {product.badge && (
                        <span className="absolute -top-3 right-4 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 px-3 py-0.5 text-xs font-semibold text-gray-950">
                          {product.badge}
                        </span>
                      )}
                      <div className="text-4xl mb-4">{product.icon}</div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">
                        {product.name}
                      </h3>
                      <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                        {product.description}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-white">
                            ${product.price}
                            <span className="text-sm font-normal text-gray-500 ml-1">+ fees</span>
                          </p>
                          {product.stateFee && (
                            <p className="text-xs text-gray-500">{product.stateFee}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-emerald-400 font-medium">
                          <Clock className="h-3.5 w-3.5" />
                          {product.processingTime.split(' ')[0]}
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-1 text-sm text-gray-400 group-hover:text-emerald-400 transition-colors">
                        Get Started
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 border-t border-white/10">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-14">
              <span className="inline-block mb-4 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-medium text-emerald-400">
                Why 1StopRemittance?
              </span>
              <h2 className="text-3xl font-bold text-white">
                Better Than the Alternatives
              </h2>
              <p className="mt-4 text-gray-400">
                We combine remittance and business services for diaspora entrepreneurs in one platform.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: '💰', title: 'Lower Prices', desc: 'Up to 60% cheaper than LegalZoom for identical government filings.' },
                { icon: '⚡', title: 'Faster Processing', desc: 'Streamlined workflows mean faster filings than traditional methods.' },
                { icon: '🌍', title: 'Built for Diaspora', desc: 'We understand immigrant entrepreneurs — services in multiple languages.' },
                { icon: '🔒', title: 'Secure & Private', desc: 'Your data is encrypted end-to-end and never sold to third parties.' },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-gray-900/50 p-6 text-center"
                >
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="text-base font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-20 border-t border-white/10">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-12">
              <h2 className="text-3xl font-bold text-white">Compare Pricing</h2>
              <p className="mt-4 text-gray-400">See how we stack up against the competition.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-3 text-left text-gray-400 font-medium">Service</th>
                    <th className="py-3 text-center text-emerald-400 font-bold">1StopRemittance</th>
                    <th className="py-3 text-center text-gray-400 font-medium">LegalZoom</th>
                    <th className="py-3 text-center text-gray-400 font-medium">ZenBusiness</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    { service: 'LLC Formation', us: '$79', lz: '$0–$299', zb: '$0–$299' },
                    { service: 'EIN Filing', us: '$79', lz: '$249 (bundle)', zb: '$99' },
                    { service: 'Registered Agent (yr 1)', us: '$99', lz: '$299', zb: '$99' },
                    { service: 'Trademark Registration', us: '$299', lz: '$499+', zb: 'N/A' },
                    { service: 'Annual Report', us: '$99', lz: '$100+', zb: '$100+' },
                    { service: 'ITIN Application', us: '$149', lz: 'N/A', zb: 'N/A' },
                  ].map((row) => (
                    <tr key={row.service} className="hover:bg-white/[0.02]">
                      <td className="py-4 text-gray-300">{row.service}</td>
                      <td className="py-4 text-center font-bold text-emerald-400">{row.us}</td>
                      <td className="py-4 text-center text-gray-400">{row.lz}</td>
                      <td className="py-4 text-center text-gray-400">{row.zb}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-4 text-xs text-gray-500">
                * Prices shown exclude government/state fees, which are identical regardless of provider. Competitor prices as of Q1 2026.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
