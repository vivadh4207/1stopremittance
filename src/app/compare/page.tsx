'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { PROVIDERS, CURRENCIES, generateProviderRates, getRate, mulberry32 } from '@/lib/constants'
import { useRates } from '@/hooks/use-rates'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import {
  Search,
  Star,
  Clock,
  TrendingUp,
  RefreshCw,
  BarChart3,
  ChevronDown,
  CheckCircle,
  ArrowUpRight,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// CurrencySelect — inline dropdown with search
// ---------------------------------------------------------------------------
function CurrencySelect({
  value,
  onChange,
  label,
}: {
  value: string
  onChange: (code: string) => void
  label: string
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selected = CURRENCIES.find((c) => c.code === value)
  const filtered = CURRENCIES.filter(
    (c) =>
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div ref={ref} className={cn('relative', open ? 'z-30' : 'z-10')}>
      <label className="mb-2 block text-xs font-medium text-gray-500">{label}</label>
      <button
        type="button"
        onClick={() => {
          setOpen(!open)
          setSearch('')
        }}
        className="flex items-center gap-2 rounded-xl border border-white/10 bg-gray-900/60 px-4 py-3 text-sm text-white transition hover:border-emerald-400/40"
      >
        <span className="text-lg">{selected?.flag}</span>
        <span className="font-semibold">{selected?.code}</span>
        <ChevronDown className={cn('h-4 w-4 text-gray-500 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute left-0 z-50 mt-2 w-64 rounded-xl border border-white/10 bg-gray-900 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
            <Search className="h-4 w-4 text-gray-500" />
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search currency..."
              className="w-full bg-transparent text-sm text-white placeholder:text-gray-500 focus:outline-none"
            />
          </div>
          <ul className="max-h-56 overflow-y-auto py-1">
            {filtered.map((c) => (
              <li key={c.code}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(c.code)
                    setOpen(false)
                  }}
                  className={cn(
                    'flex w-full items-center gap-3 px-4 py-2.5 text-sm transition hover:bg-white/5',
                    c.code === value ? 'text-emerald-400' : 'text-white',
                  )}
                >
                  <span className="text-lg">{c.flag}</span>
                  <span className="font-medium">{c.code}</span>
                  <span className="text-gray-500">{c.name}</span>
                  {c.code === value && (
                    <CheckCircle className="ml-auto h-4 w-4 text-emerald-400" />
                  )}
                </button>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="px-4 py-3 text-sm text-gray-500">No results</li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sort options
// ---------------------------------------------------------------------------
type SortKey = 'value' | 'fee' | 'rate' | 'rating'

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'value', label: 'Best Value' },
  { key: 'fee', label: 'Lowest Fee' },
  { key: 'rate', label: 'Best Rate' },
  { key: 'rating', label: 'Rating' },
]

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function ComparePage() {
  const [amount, setAmount] = useState(1000)
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('NGN')
  const [sortBy, setSortBy] = useState<SortKey>('value')
  const [showChart, setShowChart] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  // Fetch live rates from API
  const { data: rateData, loading: ratesLoading, refetch, source, lastUpdated } = useRates({
    from: fromCurrency,
    to: toCurrency,
    amount,
  })

  // Use live provider rates when available, fallback to static
  const providers = useMemo(() => {
    if (rateData?.providers && rateData.providers.length > 0) {
      return rateData.providers
    }
    return generateProviderRates(amount, fromCurrency, toCurrency)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rateData, amount, fromCurrency, toCurrency, refreshKey])

  // Sort providers
  const sorted = useMemo(() => {
    const copy = [...providers]
    switch (sortBy) {
      case 'value':
        return copy.sort((a, b) => b.received - a.received)
      case 'fee':
        return copy.sort((a, b) => a.fee - b.fee)
      case 'rate':
        return copy.sort((a, b) => b.rate - a.rate)
      case 'rating':
        return copy.sort((a, b) => b.rating - a.rating)
      default:
        return copy
    }
  }, [providers, sortBy])

  // Savings calculation
  const bestReceived = sorted[0]?.received ?? 0
  const lowestReceived = sorted[sorted.length - 1]?.received ?? 0
  const savings = +(bestReceived - lowestReceived).toFixed(2)
  const toCurrencyData = CURRENCIES.find((c) => c.code === toCurrency)
  const toSymbol = toCurrencyData?.symbol ?? ''

  // Mock rate history chart data (deterministic to avoid hydration mismatch)
  const chartData = useMemo(() => {
    const baseRate = getRate(fromCurrency, toCurrency)
    const variation = baseRate * 0.01
    const smallVariation = baseRate * 0.003
    // Seed by corridor so server/client produce the same values
    let h = 0
    for (let i = 0; i < fromCurrency.length; i++) h = (Math.imul(h, 31) + fromCurrency.charCodeAt(i)) | 0
    for (let i = 0; i < toCurrency.length; i++) h = (Math.imul(h, 31) + toCurrency.charCodeAt(i)) | 0
    const rand = mulberry32(h >>> 0)
    return Array.from({ length: 30 }, (_, i) => ({
      day: `Day ${i + 1}`,
      rate: +(baseRate + Math.sin(i / 3) * variation + rand() * smallVariation).toFixed(4),
    }))
  }, [fromCurrency, toCurrency])

  function handleSwap() {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 pb-24 pt-32">
        {/* ---- Header ---- */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Compare Live Rates
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-gray-400">
            Real-time comparison across 8+ major providers. Updated every 60
            seconds.
          </p>
        </div>

        {/* ---- Controls Bar ---- */}
        <div className="relative z-20 mb-8 rounded-2xl border border-white/10 bg-gray-900/50 p-6 backdrop-blur-xl">
          <div className="flex flex-wrap items-end gap-4">
            {/* Amount */}
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-500">
                You send
              </label>
              <input
                type="number"
                min={1}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value) || 0)}
                className="w-36 rounded-xl border border-white/10 bg-gray-900/60 px-4 py-3 text-sm font-semibold text-white focus:border-emerald-400/50 focus:outline-none focus:ring-1 focus:ring-emerald-400/50"
              />
            </div>

            {/* From */}
            <CurrencySelect
              value={fromCurrency}
              onChange={setFromCurrency}
              label="From"
            />

            {/* Swap */}
            <button
              type="button"
              onClick={handleSwap}
              className="mb-0.5 flex h-11 w-11 items-center justify-center self-end rounded-full border border-white/10 bg-gray-800 text-gray-400 transition hover:border-emerald-400/40 hover:text-emerald-400"
              aria-label="Swap currencies"
            >
              <RefreshCw className="h-4 w-4" />
            </button>

            {/* To */}
            <CurrencySelect
              value={toCurrency}
              onChange={setToCurrency}
              label="To"
            />

            {/* Refresh */}
            <button
              type="button"
              onClick={() => { refetch(); setRefreshKey((k) => k + 1) }}
              disabled={ratesLoading}
              className="mb-0.5 flex h-11 items-center gap-2 self-end rounded-xl border border-white/10 bg-gray-800 px-4 text-sm text-gray-400 transition hover:border-emerald-400/40 hover:text-emerald-400 disabled:opacity-50"
            >
              <RefreshCw className={cn('h-4 w-4', ratesLoading && 'animate-spin')} />
              {ratesLoading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
          {/* Rate source indicator */}
          {source && (
            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Rates from {source === 'fallback' ? 'cached data' : source}
              {lastUpdated && <> &middot; Updated {new Date(lastUpdated).toLocaleTimeString()}</>}
            </div>
          )}
        </div>

        {/* ---- Savings Banner ---- */}
        {savings > 0 && (
          <div className="mb-8 rounded-2xl border border-emerald-400/30 bg-gradient-to-r from-emerald-400/10 to-cyan-400/10 p-5 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400/20">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  You could save up to{' '}
                  <span className="text-emerald-400">
                    {toSymbol}
                    {savings.toLocaleString()}
                  </span>{' '}
                  by comparing providers and picking the right one!
                </p>
                <p className="text-xs text-gray-400">
                  Based on sending {CURRENCIES.find((c) => c.code === fromCurrency)?.symbol}
                  {amount.toLocaleString()} {fromCurrency} to {toCurrency}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ---- Sort Controls ---- */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="mr-2 text-sm text-gray-500">Sort by:</span>
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setSortBy(opt.key)}
              className={cn(
                'rounded-full px-4 py-1.5 text-sm font-medium transition',
                sortBy === opt.key
                  ? 'bg-emerald-400 text-gray-950'
                  : 'border border-white/10 bg-gray-900/50 text-gray-400 hover:text-white',
              )}
            >
              {opt.label}
            </button>
          ))}

          {/* Chart toggle */}
          <button
            type="button"
            onClick={() => setShowChart(!showChart)}
            className={cn(
              'ml-auto flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition',
              showChart
                ? 'bg-emerald-400 text-gray-950'
                : 'border border-white/10 bg-gray-900/50 text-gray-400 hover:text-white',
            )}
          >
            <BarChart3 className="h-4 w-4" />
            30-Day Chart
          </button>
        </div>

        {/* ---- Rate History Chart ---- */}
        {showChart && (
          <div className="mb-8 rounded-2xl border border-white/10 bg-gray-900/50 p-6 backdrop-blur-xl">
            <h3 className="mb-4 text-sm font-semibold text-white">
              {fromCurrency}/{toCurrency} Rate History (30 days)
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="rateGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#34d399" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="day"
                    tick={{ fill: '#6b7280', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    interval={4}
                  />
                  <YAxis
                    domain={['auto', 'auto']}
                    tick={{ fill: '#6b7280', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={60}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111827',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '13px',
                    }}
                    labelStyle={{ color: '#9ca3af' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="rate"
                    stroke="#34d399"
                    strokeWidth={2}
                    fill="url(#rateGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ---- Provider Cards ---- */}
        <div className="space-y-4">
          {sorted.map((provider, idx) => {
            const isTop = idx === 0
            return (
              <div
                key={provider.id}
                className={cn(
                  'group relative rounded-2xl border p-5 transition hover:bg-gray-900/80',
                  isTop
                    ? 'border-emerald-400/40 bg-gray-900/60'
                    : 'border-white/10 bg-gray-900/50',
                )}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  {/* Left: rank + provider info */}
                  <div className="flex items-center gap-4">
                    {/* Rank badge */}
                    <div
                      className={cn(
                        'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold',
                        isTop
                          ? 'bg-emerald-400/20 text-emerald-400'
                          : 'bg-gray-800 text-gray-400',
                      )}
                    >
                      {isTop ? '👑' : `#${idx + 1}`}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{provider.logo}</span>
                        <h3 className="text-lg font-semibold text-white">
                          {provider.name}
                        </h3>
                        {isTop && (
                          <span className="rounded-full bg-emerald-400/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                            Best Deal
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-sm">
                        <span className="flex items-center gap-1 text-yellow-400">
                          <Star className="h-3.5 w-3.5 fill-yellow-400" />
                          {provider.rating}
                        </span>
                        <span className="text-gray-500">
                          {provider.reviews} reviews
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Middle: rate details */}
                  <div className="flex flex-wrap items-center gap-6 text-sm sm:gap-8">
                    <div>
                      <p className="text-xs text-gray-500">Exchange rate</p>
                      <p className="font-semibold text-white">
                        1 {fromCurrency} = {provider.rate.toLocaleString()} {toCurrency}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Fee</p>
                      <p className="font-semibold text-white">
                        {CURRENCIES.find((c) => c.code === fromCurrency)?.symbol}
                        {provider.fee}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Speed</p>
                      <p className="flex items-center gap-1 font-semibold text-white">
                        <Clock className="h-3.5 w-3.5 text-gray-500" />
                        {provider.speed}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Recipient gets</p>
                      <p
                        className={cn(
                          'text-lg font-bold',
                          isTop ? 'text-emerald-400' : 'text-white',
                        )}
                      >
                        {toSymbol}
                        {provider.received.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Right: CTA — routes through affiliate tracker */}
                  <a
                    href={`/api/affiliate/click?provider=${provider.id}&corridor=${fromCurrency.toLowerCase()}-${toCurrency.toLowerCase()}&amount=${amount}`}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className={cn(
                      'inline-flex items-center gap-1 self-start whitespace-nowrap rounded-xl px-5 py-2.5 text-sm font-semibold transition sm:self-center',
                      isTop
                        ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-950 hover:opacity-90'
                        : 'border border-white/10 bg-gray-800 text-white hover:border-emerald-400/40 hover:text-emerald-400',
                    )}
                  >
                    {isTop ? 'Best Deal' : 'Send'}
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            )
          })}
        </div>

        {/* ---- Disclaimer ---- */}
        <p className="mt-8 text-center text-xs text-gray-600">
          Rates shown are indicative and updated live — they may vary slightly at checkout.
          1StopRemittance earns affiliate commissions when you click through and complete a transfer.
          This never influences the order of results — providers are ranked by amount received.{' '}
          <a href="/pricing" className="text-gray-500 hover:text-gray-400 underline">See how we make money →</a>
        </p>
      </main>

      <Footer />
    </div>
  )
}
