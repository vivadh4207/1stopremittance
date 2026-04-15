'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
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
  Mail,
  ChevronDown,
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
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />
      <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-emerald-500/20 blur-[128px] animate-pulse" />
      <div className="absolute top-1/3 right-0 h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-[128px] animate-pulse [animation-delay:1s]" />
      <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-purple-500/15 blur-[128px] animate-pulse [animation-delay:2s]" />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Section 1 : Hero                                                   */
/* ------------------------------------------------------------------ */

function HeroSection() {
  const t = useTranslations('Hero')
  const [sendAmount, setSendAmount] = useState('1000')
  const [sendCurrency, setSendCurrency] = useState('USD')
  const [receiveCurrency, setReceiveCurrency] = useState('NGN')
  const [showSendDropdown, setShowSendDropdown] = useState(false)
  const [showReceiveDropdown, setShowReceiveDropdown] = useState(false)

  const sendRef = useRef<HTMLDivElement>(null)
  const receiveRef = useRef<HTMLDivElement>(null)

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

  const { data: rateData } = useRates({
    from: sendCurrency,
    to: receiveCurrency,
  })
  const rate = rateData?.midMarketRate ?? getRate(sendCurrency, receiveCurrency)
  const receivedAmount = (amount * rate).toFixed(2)

  const sendCurrencyObj = CURRENCIES.find((c) => c.code === sendCurrency)
  const receiveCurrencyObj = CURRENCIES.find((c) => c.code === receiveCurrency)

  const stats = [
    { label: t('providers'), value: '8+', icon: Globe },
    { label: t('countries'), value: '30+', icon: TrendingUp },
    { label: t('toCompare'), value: '$0', icon: DollarSign },
    { label: t('updated'), value: t('live'), icon: Zap },
  ]

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16">
      <AnimatedBackground />

      <div className="relative z-10 mx-auto max-w-7xl w-full px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left column */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-sm font-medium text-emerald-400 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              {t('badge')}
            </span>

            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {t('titleCompare')}{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                {t('titleSave')}
              </span>{' '}
              {t('titleSendMoney')}{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                {t('titleSmarter')}
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg text-gray-400 leading-relaxed">
              {t('subtitle')}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/compare"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 px-7 py-3 text-sm font-semibold text-gray-950 transition-opacity hover:opacity-90"
              >
                {t('compareRatesNow')}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/corridors"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/5"
              >
                {t('viewCorridors')}
              </Link>
            </div>

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
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                  {t('quickRateCheck')}
                </h3>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-400">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </span>
                  {t('live')}
                </span>
              </div>

              {/* You send */}
              <div className="relative z-20">
                <label className="mb-2 block text-sm font-medium text-gray-400">
                  {t('youSend')}
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
                  {t('theyReceive')}
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
                {t('compareAllProviders')}
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
  const t = useTranslations('Corridors')
  const popular = ['usd-to-ngn', 'usd-to-php']
  const { data: rateData } = useRates({ from: 'USD', to: 'NGN' })

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          badge={t('badge')}
          title={<>{t('title')} {rateData?.source && rateData.source !== 'fallback' && <span className="inline-flex items-center gap-1 ml-2 text-xs font-normal text-emerald-400"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />Live</span>}</>}
          subtitle={t('subtitle')}
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_CORRIDORS.map((corridor) => {
            const rate = rateData?.rates
              ? (rateData.rates[corridor.to] || 1) / (rateData.rates[corridor.from] || 1)
              : getRate(corridor.from, corridor.to)
            const isMostPopular = popular.includes(corridor.slug)
            return (
              <Link key={corridor.slug} href={`/corridors/${corridor.slug}`}>
                <GlassCard className="group relative p-6 transition-colors hover:border-emerald-400/30">
                  {isMostPopular && (
                    <span className="absolute -top-3 right-4 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 px-3 py-0.5 text-xs font-semibold text-gray-950">
                      {t('mostPopular')}
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
                      <p className="text-xs text-gray-500">{t('midMarketRate')}</p>
                      <p className="text-xl font-bold text-emerald-400">
                        1 {corridor.from} = {rate.toFixed(2)} {corridor.to}
                      </p>
                    </div>
                    <span className="flex items-center gap-1 text-sm font-medium text-gray-400 transition-colors group-hover:text-emerald-400">
                      {t('compareNow')}
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
  const t = useTranslations('HowItWorks')
  const steps = [
    { num: '01', title: t('step1Title'), description: t('step1Desc'), icon: Search },
    { num: '02', title: t('step2Title'), description: t('step2Desc'), icon: Award },
    { num: '03', title: t('step3Title'), description: t('step3Desc'), icon: Send },
  ]

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          badge={t('badge')}
          title={t('title')}
          subtitle={t('subtitle')}
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
  const t = useTranslations('Providers')

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          badge={t('badge')}
          title={t('title')}
          subtitle={t('subtitle')}
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
                {p.reviews} {t('reviews')}
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs text-gray-400">
                <Clock className="h-3.5 w-3.5 text-emerald-400" />
                {t('typicalSpeed')} {p.speed}
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
  const t = useTranslations('Trust')
  const badges = [
    { title: t('bankSecurity'), description: t('bankSecurityDesc'), icon: Shield },
    { title: t('dataProtected'), description: t('dataProtectedDesc'), icon: Lock },
    { title: t('realTimeRates'), description: t('realTimeRatesDesc'), icon: Zap },
    { title: t('trustedByUsers'), description: t('trustedByUsersDesc'), icon: Users },
  ]

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          badge={t('badge')}
          title={t('title')}
          subtitle={t('subtitle')}
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
  const t = useTranslations('Testimonials')
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
          badge={t('badge')}
          title={t('title')}
          subtitle={t('subtitle')}
        />

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <GlassCard key={testimonial.name} className="p-6">
              <StarRating rating={testimonial.rating} />
              <p className="mt-4 text-sm leading-relaxed text-gray-300">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 text-sm font-bold text-gray-950">
                  {testimonial.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{testimonial.name}</p>
                  <p className="text-xs text-gray-500">{testimonial.location}</p>
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
  const t = useTranslations('EmailCTA')
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
          {t('title')}
        </h2>
        <p className="mt-4 text-lg text-gray-400">
          {t('subtitle')}
        </p>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('placeholder')}
            className="flex-1 rounded-xl border border-white/10 bg-gray-800/60 px-5 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/30"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-6 py-3 text-sm font-semibold text-gray-950 transition-opacity hover:opacity-90"
          >
            {t('subscribe')}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <p className="mt-4 text-xs text-gray-500">
          {t('disclaimer')}
        </p>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Section 8 : Premium & API Promo                                   */
/* ------------------------------------------------------------------ */

function PremiumPromo() {
  const t = useTranslations('Premium')
  const perks = [
    { icon: '🔔', title: t('unlimitedAlerts'), desc: t('unlimitedAlertsDesc') },
    { icon: '📊', title: t('rateHistory'), desc: t('rateHistoryDesc') },
    { icon: '🎯', title: t('predictions'), desc: t('predictionsDesc') },
    { icon: '🔌', title: t('apiWhiteLabel'), desc: t('apiWhiteLabelDesc') },
  ]

  return (
    <section className="relative py-24 overflow-hidden border-t border-white/10">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5" />
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          badge={t('badge')}
          title={<>{t('title')} <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">{t('titleHighlight')}</span></>}
          subtitle={t('subtitle')}
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
            {t('viewPlans')}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/api-access"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3 text-sm font-semibold text-white hover:bg-white/5 transition-colors"
          >
            {t('exploreApi')}
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
