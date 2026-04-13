'use client'

import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import {
  Heart,
  Shield,
  Users,
  Zap,
  Globe,
  DollarSign,
  ArrowRight,
  Mail,
  Eye,
  Scale,
} from 'lucide-react'

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-950 pt-28 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-20">
            <span className="inline-block mb-4 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-medium text-emerald-400">
              Our Story
            </span>
            <h1 className="text-4xl font-bold text-white sm:text-5xl mb-6">
              About{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                1StopRemittance
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              We help the diaspora community find the best rates and lowest fees for sending money home. Free, transparent, and always on your side.
            </p>
          </div>

          {/* Mission */}
          <div className="bg-gray-900/50 border border-white/10 rounded-3xl p-8 sm:p-10 mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400/20 to-cyan-400/20">
                <Heart className="h-6 w-6 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Our Mission</h2>
            </div>
            <p className="text-gray-400 leading-relaxed text-lg">
              We help Nigerian, Filipino, and other diaspora communities in the United States find the best exchange rates and lowest fees for sending money home. We compare 8+ major providers — Wise, Remitly, Western Union, and more — so you can make informed decisions and keep more money in your family&apos;s pocket.
            </p>
          </div>

          {/* Why we exist */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Why We Exist</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-6 text-center">
                <div className="text-4xl font-bold text-emerald-400 mb-2">$56B+</div>
                <p className="text-gray-400 text-sm">sent from the US annually in remittances</p>
              </div>
              <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-6 text-center">
                <div className="text-4xl font-bold text-emerald-400 mb-2">$100-300</div>
                <p className="text-gray-400 text-sm">lost per family per year to bad rates and hidden fees</p>
              </div>
              <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-6 text-center">
                <div className="text-4xl font-bold text-emerald-400 mb-2">100%</div>
                <p className="text-gray-400 text-sm">free comparison tool — we built this to fix the problem</p>
              </div>
            </div>
          </div>

          {/* How we make money - transparency */}
          <div className="bg-emerald-400/5 border border-emerald-400/20 rounded-3xl p-8 sm:p-10 mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/20">
                <DollarSign className="h-6 w-6 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">How We Make Money</h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <div className="flex items-start gap-3">
                <span className="text-emerald-400 mt-1">&#x2713;</span>
                <p>We earn commissions when you use our partner links to send money through a provider.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-emerald-400 mt-1">&#x2713;</span>
                <p>This <strong className="text-white">NEVER</strong> affects our rankings — we always show the cheapest option first.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-emerald-400 mt-1">&#x2713;</span>
                <p>Our service is <strong className="text-white">100% free</strong> for you. You never pay us anything.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-emerald-400 mt-1">&#x2713;</span>
                <p>We compare all providers equally, whether or not they have a partnership with us.</p>
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Our Values</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {[
                { icon: Eye, title: 'Transparency', desc: 'We show you exactly what each provider charges — fees, exchange rate markup, and total cost. No hidden surprises.' },
                { icon: Scale, title: 'Independence', desc: 'Our rankings are based on data, not payments. The provider offering the best deal always appears first.' },
                { icon: Users, title: 'Community', desc: 'Built by and for the diaspora community. We understand the importance of every dollar sent home.' },
                { icon: Zap, title: 'Accuracy', desc: 'Rates are compared in real-time across all providers. We update continuously so you always see current prices.' },
              ].map((v) => (
                <div key={v.title} className="bg-gray-900/50 border border-white/10 rounded-2xl p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 mb-4">
                    <v.icon className="h-6 w-6 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{v.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="bg-gray-900/50 border border-white/10 rounded-3xl p-8 sm:p-10 mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400/20 to-cyan-400/20">
                <Mail className="h-6 w-6 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Get in Touch</h2>
            </div>
            <p className="text-gray-400 mb-6">
              Have a suggestion, found an error, or want to partner with us? We&apos;d love to hear from you.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4 max-w-lg">
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="Your name"
                  className="rounded-xl border border-white/10 bg-gray-800/60 px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-emerald-400/50"
                />
                <input
                  type="email"
                  placeholder="Your email"
                  className="rounded-xl border border-white/10 bg-gray-800/60 px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-emerald-400/50"
                />
              </div>
              <textarea
                rows={4}
                placeholder="Your message"
                className="w-full rounded-xl border border-white/10 bg-gray-800/60 px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-emerald-400/50 resize-none"
              />
              <button type="submit" className="px-6 py-3 bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900 font-bold rounded-xl text-sm">
                Send Message
              </button>
            </form>
          </div>

          {/* CTA */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Ready to start saving?</h2>
            <p className="text-gray-400 mb-6">Compare rates from 8+ providers in seconds. It&apos;s free.</p>
            <Link
              href="/compare"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900 font-bold rounded-full text-sm"
            >
              Compare Rates Now <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
