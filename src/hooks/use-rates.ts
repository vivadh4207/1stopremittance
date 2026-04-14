'use client'

import { useState, useEffect, useCallback } from 'react'

interface ProviderRate {
  id: string
  name: string
  logo: string
  rating: number
  reviews: string
  speed: string
  color: string
  url: string
  rate: number
  fee: number
  received: number
  total: number
  markup: number
}

interface RateResponse {
  from: string
  to: string
  midMarketRate: number
  rates: Record<string, number>
  source: string
  lastUpdated: string
  nextUpdate: string
  amount?: number
  providers?: ProviderRate[]
}

interface UseRatesOptions {
  from: string
  to: string
  amount?: number
  enabled?: boolean
}

interface UseRatesReturn {
  data: RateResponse | null
  loading: boolean
  error: string | null
  refetch: () => void
  lastUpdated: string | null
  source: string | null
}

/**
 * React hook for fetching live exchange rates.
 *
 * Usage:
 *   const { data, loading } = useRates({ from: 'USD', to: 'NGN', amount: 1000 })
 *   // data.midMarketRate — the live mid-market rate
 *   // data.providers — ranked provider comparison with amounts
 */
export function useRates({ from, to, amount, enabled = true }: UseRatesOptions): UseRatesReturn {
  const [data, setData] = useState<RateResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRates = useCallback(async () => {
    if (!enabled) return

    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({ from, to })
      if (amount && amount > 0) {
        params.set('amount', amount.toString())
      }

      const res = await fetch(`/api/rates?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to fetch rates')

      const json = await res.json()
      setData(json)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch rates')
    } finally {
      setLoading(false)
    }
  }, [from, to, amount, enabled])

  useEffect(() => {
    fetchRates()
  }, [fetchRates])

  // Auto-refresh every 2 hours
  useEffect(() => {
    if (!enabled) return
    const interval = setInterval(fetchRates, 2 * 60 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchRates, enabled])

  return {
    data,
    loading,
    error,
    refetch: fetchRates,
    lastUpdated: data?.lastUpdated || null,
    source: data?.source || null,
  }
}
