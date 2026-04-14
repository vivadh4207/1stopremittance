'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  Search,
  ArrowRight,
  Globe,
  Shield,
  Zap,
  Star,
  Send,
  Award,
  Lock,
  Heart,
  Mail,
  ChevronDown,
  CheckCircle,
  ArrowUpRight,
  Clock,
  DollarSign,
  Users,
  TrendingUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  PROVIDERS,
  CURRENCIES,
  FEATURED_CORRIDORS,
  getRate,
} from '@/lib/constants'
import { useRates } from '@/hooks/use-rates'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

/* ------------------------------------------------------------------ */
/*  Shared helpers                                                     */
/* ------------------------------------------------------------------ */

function GlassCard({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'bg-gray-900/50 border border-white/10 rounded-2xl backdrop-blur-xl',
        className,
      )}
    >
      {children}
    </div>
  )
}

function SectionHeading({
  badge,
  title,
  subtitle,
}: {
  badge?: string
  title: React.ReactNode
  subtitle?: string
}) {
  return (
    <div className="mx-auto max-w-2xl text-center mb-14">
      {badge && (
        <span className="inline-block mb-4 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-medium text-emerald-400">
          {badge}
        </span>
      )}
      <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg text-gray-400">{subtitle}</p>
      )}
    </div>
  )
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            'h-4 w-4',
            i < Math.round(rating)
              ? 'fill-yellow-400 text-yellow-400'
              : 'fill-gray-700 text-gray-700',
          )}
        />
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Animated background (shared by hero)                               */
/* ------------------------------------------------------------------ */

function AnimatedBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />
      {/* Emerald glow */}
      <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-emerald-500/20 blur-[128px] animate-pulse" />
      {/* Cyan glow */}
      <div className="absolute top-1/3 right-0 h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-[128px] animate-pulse [animation-delay:1s]" />
      {/* Purple glow */}
      <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-purple-500/15 blur-[128px] animate-pulse [animation-delay:2s]" />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Section 1 : Hero                                                   */
/* ------------------------------------------------------------------ */

function HeroSection() {
  const [sendAmount, setSendAmount] = useState('1000')
  const [sendCurrency, setSendCurrency] = useState('USD')
  const [receiveCurrency, setReceiveCurrency] = useState('NGN')
  const [showSendDropdown, setShowSendDropdown] = useState(false)
  const [showReceiveDropdown, setShowReceiveDropdown] = useState(false)

  const sendRef = useRef<HTMLDivElement>(null)
  const receiveRef = useRef<HTMLDivElement>(null)

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (sendRef.current && !sendRef.current.contains(e.target as Node))
        setShowSendDropdown(false)
      if (receiveRef.current && !receiveRef.current.contains(e.target as Node))
        setShowReceiveDropdown(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const amount = parseFloat(sendAmount) || 0

  // Fetch live rates from API
  const { data: rateData, loading: ratesLoading } = useRates({
    from: sendCurrency,
    to: receiveCurrency,
  })
  // Use live rate if available, fallback to static
  const rate = rateData?.midMarketRate ?? getRate(sendCurrency, receiveCurrency)
  const receivedAmount = (amount * rate).toFixed(2)

  const sendCurrencyObj = CURRENCIES.find((c) => c.code === sendCurrency)
  const receiveCurrencyObj = CURRENCIES.find((c) => c.code === receiveCurrency)

  const stats = [
    { label: 'Providers', value: '8+', icon: Globe },
    { label: 'Countries', value: '30+', icon: TrendingUp },
    { label: 'To Compare', value: '$0', icon: DollarSign },
    { label: 'Updated', value: 'Live', icon: Zap },
  ]

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16">
      <AnimatedBackground />

      <div className="relative z-10 mx-auto max-w-7xl w-full px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left column */}
          <div>
            {/* Badge */}
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-sm font-medium text-emerald-400 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Live rates from 8+ providers
            </span>

            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Compare.{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Save.
              </span>{' '}
              Send Money{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Smarter.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg text-gray-400 leading-relaxed">
              Find the best rates to send money to Nigeria, Philippines &amp;
              30+ countries. Compare Wise, Remitly, Western Union &amp; more.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/compare"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 px-7 py-3 text-sm font-semibold text-gray-950 transition-opacity hover:opacity-90"
              >
                Compare Rates Now
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/corridors"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/5"
              >
                View Corridors
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400/20 to-cyan-400/20">
                    <s.icon className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white">{s.value}</p>
                    <p className="text-xs text-gray-500">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column: calculator card */}
          <div className="flex justify-center lg:justify-end">
            <GlassCard className="w-full max-w-md p-6 space-y-5">
              {/* Title */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                  Quick Rate Check
                </h3>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-400">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </span>
                  Live
                </span>
              </div>

              {/* You send */}
              <div className="relative z-20">
                <label className="mb-2 block text-sm font-medium text-gray-400">
                  You send
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-gray-800/60 px-4 py-3">
                  <input
                    type="number"
                    min="0"
                    value={sendAmount}
                    onChange={(e) => setSendAmount(e.target.value)}
                    className="flex-1 bg-transparent text-xl font-semibold text-white outline-none placeholder:text-gray-600 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    placeholder="0.00"
                  />
                  {/* Currency selector */}
                  <div className="relative" ref={sendRef}>
                    <button
                      type="button"
                      onClick={() => setShowSendDropdown((v) => !v)}
                      className="flex items-center gap-1.5 rounded-lg bg-gray-700/60 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-700"
                    >
                      <span>{sendCurrencyObj?.flag}</span>
                      <span>{sendCurrency}</span>
                      <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                    </button>
                    {showSendDropdown && (
                      <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-xl border border-white/10 bg-gray-900 py-1 shadow-2xl backdrop-blur-xl">
                        {CURRENCIES.map((c) => (
                          <button
                            key={c.code}
                            type="button"
                            onClick={() => {
                              setSendCurrency(c.code)
                              setShowSendDropdown(false)
                            }}
                            className={cn(
                              'flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-white/5',
                              c.code === sendCurrency
                                ? 'text-emerald-400'
                                : 'text-gray-300',
                            )}
                          >
                            <span>{c.flag}</span>
                            <span>{c.code}</span>
                            <span className="ml-auto text-xs text-gray-500">
                              {c.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Exchange rate indicator */}
              <div className="flex items-center justify-center gap-3 text-sm text-gray-400">
                <div className="h-px flex-1 bg-white/10" />
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />1{' '}
                  {sendCurrency} = {rate.toFixed(4)} {receiveCurrency}
                </span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              {/* They receive */}
              <div className="relative z-10">
                <label className="mb-2 block text-sm font-medium text-gray-400">
                  They receive
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-gray-800/60 px-4 py-3">
                  <span className="flex-1 text-xl font-semibold text-white">
                    {Number(receivedAmount).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  <div className="relative" ref={receiveRef}>
                    <button
                      type="button"
                      onClick={() => setShowReceiveDropdown((v) => !v)}
                      className="flex items-center gap-1.5 rounded-lg bg-gray-700/60 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-700"
                    >
                      <span>{receiveCurrencyObj?.flag}</span>
                      <span>{receiveCurrency}</span>
                      <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                    </button>
                    {showReceiveDropdown && (
                      <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-xl border border-white/10 bg-gray-900 py-1 shadow-2xl backdrop-blur-xl">
                        {CURRENCIES.map((c) => (
                          <button
                            key={c.code}
                            type="button"
                            onClick={() => {
                              setReceiveCurrency(c.code)
                              setShowReceiveDropdown(false)
                            }}
                            className={cn(
                              'flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-white/5',
                              c.code === receiveCurrency
                                ? 'text-emerald-400'
                                : 'text-gray-300',
                            )}
                          >
                            <span>{c.flag}</span>
                            <span>{c.code}</span>
                            <span className="ml-auto text-xs text-gray-500">
                              {c.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* CTA */}
              <Link
                href="/compare"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-6 py-3.5 text-sm font-semibold text-gray-950 transition-opacity hover:opacity-90"
              >
                Compare All Providers
                <ArrowRight className="h-4 w-4" />
              </Link>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Section 2 : Featured Corridors                                     */
/* ------------------------------------------------------------------ */

function FeaturedCorridors() {
  const popular = ['usd-to-ngn', 'usd-to-php']
  // Fetch all rates once for corridor cards
  const { data: rateData } = useRates({ from: 'USD', to: 'NGN' })

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          badge="Top Routes"
          title={<>Popular Corridors for Diaspora {rateData?.source && rateData.source !== 'fallback' && <span className="inline-flex items-center gap-1 ml-2 text-xs font-normal text-emerald-400"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />Live</span>}</>}
          subtitle="Real-time mid-market rates for the most popular remittance corridors from the US."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_CORRIDORS.map((corridor) => {
            // Use live rates if available, fallback to static
            const rate = rateData?.rates
              ? (rateData.rates[corridor.to] || 1) / (rateData.rates[corridor.from] || 1)
              : getRate(corridor.from, corridor.to)
            const isMostPopular = popular.includes(corridor.slug)
            return (
              <Link key={corridor.slug} href={`/corridors/${corridor.slug}`}>
                <GlassCard className="group relative p-6 transition-colors hover:border-emerald-400/30">
                  {isMostPopular && (
                    <span className="absolute -top-3 right-4 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 px-3 py-0.5 text-xs font-semibold text-gray-950">
                      Most Popular
                    </span>
                  )}
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{corridor.flag}</span>
                    <div className="flex-1">
                      <p className="text-sm text-gray-400">
                        {corridor.from} <ArrowRight className="inline h-3 w-3" />{' '}
                        {corridor.to}
                      </p>
                      <p className="text-lg font-bold text-white">
                        {corridor.label}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Mid-market rate</p>
                      <p className="text-xl font-bold text-emerald-400">
                        1 {corridor.from} = {rate.toFixed(2)} {corridor.to}
                      </p>
                    </div>
                    <span className="flex items-center gap-1 text-sm font-medium text-gray-400 transition-colors group-hover:text-emerald-400">
                      Compare Now
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </GlassCard>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Section 3 : How It Works                                           */
/* ------------------------------------------------------------------ */

function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Compare Rates',
      description:
        'Enter the amount and corridor. We fetch live rates, fees, and speeds from 8+ providers instantly.',
      icon: Search,
    },
    {
      num: '02',
      title: 'Choose Best Deal',
      description:
        'See a transparent side-by-side comparison. Sort by total received, fee, or delivery speed.',
      icon: Award,
    },
    {
      num: '03',
      title: 'Send & Save',
      description:
        'Click through to your chosen provider and complete the transfer. Save up to 8x on fees.',
      icon: Send,
    },
  ]

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          badge="Simple Process"
          title="How It Works"
          subtitle="Three simple steps to find the best remittance deal."
        />

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <GlassCard key={step.num} className="relative p-8 text-center">
              <span className="absolute top-4 right-4 text-5xl font-extrabold text-white/[.04]">
                {step.num}
              </span>
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400/20 to-cyan-400/20">
                <step.icon className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">
                {step.description}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Section 4 : Provider Showcase                                      */
/* ------------------------------------------------------------------ */

function ProviderShowcase() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          badge="Trusted Partners"
          title="Trusted Providers We Compare"
          subtitle="We compare rates and fees from the world's leading money transfer services so you don't have to."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PROVIDERS.map((p) => (
            <GlassCard
              key={p.id}
              className="group p-6 transition-colors hover:border-emerald-400/30"
            >
              <div className="mb-4 text-4xl">{p.logo}</div>
              <h3 className="text-lg font-semibold text-white">{p.name}</h3>
              <div className="mt-2 flex items-center gap-2">
                <StarRating rating={p.rating} />
                <span className="text-xs text-gray-500">{p.rating}</span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {p.reviews} reviews
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs text-gray-400">
                <Clock className="h-3.5 w-3.5 text-emerald-400" />
                Typical speed: {p.speed}
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Section 5 : Trust & Security                                       */
/* ------------------------------------------------------------------ */

function TrustSecurity() {
  const badges = [
    {
      title: 'Bank-Level Security',
      description: '256-bit SSL encryption protects all your data.',
      icon: Shield,
    },
    {
      title: 'Data Protected',
      description: 'We never store or share your personal information.',
      icon: Lock,
    },
    {
      title: 'Real-Time Rates',
      description: 'Rates are fetched live from every provider for accuracy.',
      icon: Zap,
    },
    {
      title: 'Trusted by Users',
      description: 'Thousands of diaspora members rely on us every month.',
      icon: Users,
    },
  ]

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          badge="Your Data is Safe"
          title="Trust & Security"
          subtitle="We are a comparison platform. We never handle your money or personal data."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {badges.map((b) => (
            <GlassCard key={b.title} className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400/20 to-cyan-400/20">
                <b.icon className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-base font-semibold text-white">{b.title}</h3>
              <p className="mt-2 text-sm text-gray-400">{b.description}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Section 6 : Testimonials                                           */
/* ------------------------------------------------------------------ */

function Testimonials() {
  const testimonials = [
    {
      name: 'Chinedu Okafor',
      location: 'Houston, TX',
      quote:
        'I used to default to Western Union every time. 1StopRemittance showed me I was overpaying by nearly $40 per transfer to Lagos. Switched to Wise and the savings are real.',
      rating: 5,
    },
    {
      name: 'Maria Santos',
      location: 'Los Angeles, CA',
      quote:
        'Sending money to my family in Manila is so much easier now. I just compare the rates and pick the cheapest one. Saved over $200 in the last 3 months alone.',
      rating: 5,
    },
    {
      name: 'Adaeze Nnamdi',
      location: 'Brooklyn, NY',
      quote:
        'The rate alerts are a game-changer. I get notified when NGN rates are favorable and send at the perfect time. My family receives more naira every single transfer.',
      rating: 4,
    },
  ]

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          badge="Real Stories"
          title="What Our Users Say"
          subtitle="Hear from Nigerian and Filipino diaspora members who save money on every transfer."
        />

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((t) => (
            <GlassCard key={t.name} className="p-6">
              <StarRating rating={t.rating} />
              <p className="mt-4 text-sm leading-relaxed text-gray-300">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 text-sm font-bold text-gray-950">
                  {t.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.location}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Section 7 : Email CTA                                              */
/* ------------------------------------------------------------------ */

function EmailCTA() {
  const [email, setEmail] = useState('')

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10" />
      <div className="absolute inset-0 border-y border-white/10" />
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center lg:px-8">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400/20 to-cyan-400/20">
          <Mail className="h-7 w-7 text-emerald-400" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Get Rate Alerts for Your Corridor
        </h2>
        <p className="mt-4 text-lg text-gray-400">
          Join 50,000+ diaspora members getting the best rates delivered to
          their inbox.
        </p>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 rounded-xl border border-white/10 bg-gray-800/60 px-5 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/30"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-6 py-3 text-sm font-semibold text-gray-950 transition-opacity hover:opacity-90"
          >
            Subscribe
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <p className="mt-4 text-xs text-gray-500">
          Free forever. Unsubscribe anytime. No spam.
        </p>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Section 8 : Premium & API Promo                                   */
/* ------------------------------------------------------------------ */

function PremiumPromo() {
  const perks = [
    { icon: '🔔', title: 'Unlimited Rate Alerts', desc: 'Get notified the moment your corridor hits your target rate — via SMS or email.' },
    { icon: '📊', title: '90-Day Rate History', desc: 'See exactly when rates peak and trough. Send at the right moment, every time.' },
    { icon: '🎯', title: 'Best-Time Predictions', desc: 'Our model analyzes patterns and tells you if you should send now or wait.' },
    { icon: '🔌', title: 'API & White-Label', desc: 'Power your app or bank with live rates. Embed our widget under your brand.' },
  ]

  return (
    <section className="relative py-24 overflow-hidden border-t border-white/10">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5" />
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          badge="Pro & API"
          title={<>Save More with <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Pro Alerts</span></>}
          subtitle="Free comparison gets you started. Pro alerts and rate predictions get your family more money on every transfer."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-10">
          {perks.map((p) => (
            <GlassCard key={p.title} className="p-5">
              <div className="text-3xl mb-3">{p.icon}</div>
              <h3 className="text-base font-semibold text-white">{p.title}</h3>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">{p.desc}</p>
            </GlassCard>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 px-7 py-3 text-sm font-semibold text-gray-950 hover:opacity-90 transition-opacity"
          >
            View Plans — From Free
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/api-access"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3 text-sm font-semibold text-white hover:bg-white/5 transition-colors"
          >
            Explore the API
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedCorridors />
        <HowItWorks />
        <PremiumPromo />
        <ProviderShowcase />
        <TrustSecurity />
        <Testimonials />
        <EmailCTA />
      </main>
      <Footer />
    </>
  )
}
