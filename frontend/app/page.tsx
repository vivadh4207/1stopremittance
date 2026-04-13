import React from 'react';
import Link from 'next/link';
import {
  DollarSign,
  Zap,
  Shield,
  Globe,
  Clock,
  Star,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Phone,
  HeadphonesIcon,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">1Stop Remittance</span>
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm text-gray-600 hover:text-primary-600 dark:text-gray-400">Features</a>
            <a href="#pricing" className="text-sm text-gray-600 hover:text-primary-600 dark:text-gray-400">Pricing</a>
            <a href="#how-it-works" className="text-sm text-gray-600 hover:text-primary-600 dark:text-gray-400">How it Works</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-300">
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-purple-800 py-24 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-white" />
          <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-purple-300" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm">
              <Star className="h-4 w-4 text-yellow-300" />
              Trusted by 500K+ customers worldwide
            </div>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Send Money Worldwide,
              <br />
              <span className="text-yellow-300">Instantly</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-100">
              Low fees, great exchange rates, and bank-level security. Send to 50+ countries in
              minutes.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/register"
                className="flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-primary-700 shadow-lg hover:bg-primary-50 transition-colors"
              >
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="#calculator"
                className="rounded-xl border border-white/30 px-8 py-3.5 text-base font-medium text-white hover:bg-white/10 transition-colors"
              >
                See Live Rates
              </a>
            </div>
            <div className="mt-10 inline-flex items-center gap-3 rounded-2xl bg-white/15 px-6 py-3 backdrop-blur-sm">
              <div className="text-left">
                <p className="text-xs text-primary-200">Example rate</p>
                <p className="text-lg font-bold">1 USD = 130.45 KES</p>
              </div>
              <div className="h-8 w-px bg-white/30" />
              <div className="text-left">
                <p className="text-xs text-primary-200">Fee from</p>
                <p className="text-lg font-bold">1.5% + $2.99</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-b border-gray-100 bg-gray-50 py-8 dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { label: 'Customers', value: '500K+' },
              { label: 'Total Sent', value: '$2B+' },
              { label: 'Countries', value: '50+' },
              { label: 'App Rating', value: '4.8/5 ⭐' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-extrabold text-primary-600">{s.value}</p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">How It Works</h2>
            <p className="mt-3 text-gray-500 dark:text-gray-400">Send money in 3 simple steps</p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {[
              { step: '01', icon: <Shield className="h-7 w-7" />, title: 'Create Account', desc: 'Sign up in minutes and verify your identity with our secure KYC process.' },
              { step: '02', icon: <DollarSign className="h-7 w-7" />, title: 'Add Funds', desc: 'Fund your transfer with a debit or credit card via our secure Stripe integration.' },
              { step: '03', icon: <Zap className="h-7 w-7" />, title: 'Send Money', desc: 'Enter recipient details and your money arrives in minutes. Track in real-time.' },
            ].map((item) => (
              <div key={item.step} className="relative rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-900/30">
                  {item.icon}
                </div>
                <div className="absolute right-4 top-4 text-4xl font-black text-gray-100 dark:text-gray-700">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-gray-50 py-20 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Why Choose 1Stop?</h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: <DollarSign className="h-6 w-6 text-green-600" />, bg: 'bg-green-100', title: 'Low Fees', desc: 'Just 1.5% + $2.99 per transfer. No hidden charges ever.' },
              { icon: <TrendingUp className="h-6 w-6 text-blue-600" />, bg: 'bg-blue-100', title: 'Live Exchange Rates', desc: 'Real-time rates refreshed every 5 minutes for all corridors.' },
              { icon: <Shield className="h-6 w-6 text-purple-600" />, bg: 'bg-purple-100', title: 'Bank-level Security', desc: '256-bit SSL encryption and two-factor authentication.' },
              { icon: <Zap className="h-6 w-6 text-yellow-600" />, bg: 'bg-yellow-100', title: 'Fast Delivery', desc: 'Most transfers arrive within minutes, some within seconds.' },
              { icon: <CheckCircle className="h-6 w-6 text-indigo-600" />, bg: 'bg-indigo-100', title: 'KYC Verified', desc: 'Fully regulated and compliant with international AML standards.' },
              { icon: <HeadphonesIcon className="h-6 w-6 text-pink-600" />, bg: 'bg-pink-100', title: '24/7 Support', desc: 'Our team is always available to help via chat, email or phone.' },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800">
                <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${f.bg}`}>
                  {f.icon}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{f.title}</h3>
                <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section id="calculator" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 to-purple-700 p-8 text-white shadow-2xl md:p-12">
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <h2 className="text-3xl font-bold">See How Much They Receive</h2>
                <p className="mt-3 text-primary-100">
                  Enter an amount to see live rates. No registration needed.
                </p>
                <div className="mt-8 space-y-4">
                  {[
                    { from: 'USD', to: 'KES', rate: '130.45', flag: '🇰🇪' },
                    { from: 'USD', to: 'NGN', rate: '1,540.00', flag: '🇳🇬' },
                    { from: 'USD', to: 'GHS', rate: '15.80', flag: '🇬🇭' },
                    { from: 'USD', to: 'PHP', rate: '58.20', flag: '🇵🇭' },
                  ].map((r) => (
                    <div
                      key={r.to}
                      className="flex items-center justify-between rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm"
                    >
                      <span className="text-sm font-medium">
                        {r.flag} 1 {r.from} → {r.to}
                      </span>
                      <span className="font-bold">{r.rate}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl bg-white p-6 text-gray-900 shadow-xl">
                <h3 className="mb-4 text-lg font-semibold">Quick Calculator</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">You send (USD)</label>
                    <div className="rounded-lg border border-gray-200 px-3 py-2.5 text-lg font-semibold">
                      $100.00
                    </div>
                  </div>
                  <div className="flex items-center justify-center text-gray-400">↓ convert</div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">They receive (KES)</label>
                    <div className="rounded-lg border border-primary-200 bg-primary-50 px-3 py-2.5 text-lg font-semibold text-primary-700">
                      KES 12,748.87
                    </div>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 text-xs text-gray-500">
                    Fee: $2.99 • Rate: 130.45 • Total: $102.99
                  </div>
                </div>
                <Link
                  href="/register"
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 py-3 text-sm font-semibold text-white hover:bg-primary-700"
                >
                  Get this rate <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-gray-50 py-20 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Simple, Transparent Pricing</h2>
            <p className="mt-3 text-gray-500 dark:text-gray-400">No surprises. Ever.</p>
          </div>
          <div className="mx-auto mt-10 max-w-2xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <table className="w-full">
              <thead className="bg-primary-50 dark:bg-primary-900/20">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-primary-700 dark:text-primary-400">Transfer amount</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-primary-700 dark:text-primary-400">Fee</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-primary-700 dark:text-primary-400">Speed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {[
                  { range: '$1 – $999', fee: '1.5% + $2.99', speed: 'Minutes' },
                  { range: '$1,000 – $4,999', fee: '1.0% + $2.99', speed: 'Minutes' },
                  { range: '$5,000+', fee: '0.75% + $2.99', speed: 'Same day' },
                ].map((row) => (
                  <tr key={row.range} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{row.range}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{row.fee}</td>
                    <td className="px-6 py-4 text-sm text-green-600">{row.speed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white">What Customers Say</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              { name: 'Maria K.', country: '🇳🇬 Nigeria', quote: "The rates are incredible and money arrives so fast. My family receives funds within minutes every time." },
              { name: 'Raj P.', country: '🇮🇳 India', quote: "I've been using 1Stop for 2 years. Best service ever. Their customer support is always there when needed." },
              { name: 'Grace M.', country: '🇰🇪 Kenya', quote: "Finally a remittance app with no hidden fees. The exchange rate widget helps me decide when to send." },
            ].map((t) => (
              <div key={t.name} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="mb-3 flex text-yellow-400">
                  {Array(5).fill(0).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">"{t.quote}"</p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-600">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.country}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-600 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold text-white">Ready to send money worldwide?</h2>
          <p className="mt-3 text-primary-100">Join 500,000+ customers sending money with 1Stop.</p>
          <Link
            href="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-primary-700 hover:bg-primary-50"
          >
            Create your free account <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 text-gray-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-600">
                  <DollarSign className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-semibold text-white">1Stop Remittance</span>
              </div>
              <p className="text-xs leading-relaxed">Fast, secure international money transfers to 50+ countries.</p>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'How it Works', 'Security'] },
              { title: 'Company', links: ['About', 'Careers', 'Blog', 'Press'] },
              { title: 'Support', links: ['Help Center', 'Contact', 'Privacy', 'Terms'] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="mb-3 text-sm font-semibold text-white">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a href="#" className="text-xs hover:text-white transition-colors">{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 border-t border-gray-800 pt-8 text-center text-xs">
            © {new Date().getFullYear()} 1Stop Remittance. All rights reserved. Licensed money transmitter.
          </div>
        </div>
      </footer>
    </div>
  );
}
