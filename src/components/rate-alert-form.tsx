'use client'

import { useState } from 'react'
import { Bell, CheckCircle2, AlertCircle } from 'lucide-react'

const CURRENCIES = ['USD', 'NGN', 'PHP', 'INR', 'GBP', 'EUR', 'MXN', 'PKR', 'GHS', 'KES', 'BDT', 'CAD'] as const

type Status = 'idle' | 'submitting' | 'success' | 'error'

interface Props {
  /** Optional corridor defaults (e.g., pre-fill from a corridor page) */
  defaultFrom?: string
  defaultTo?: string
  compact?: boolean
}

export function RateAlertForm({
  defaultFrom = 'USD',
  defaultTo = 'NGN',
  compact = false,
}: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')

    const form = e.currentTarget
    const data = new FormData(form)

    const payload = {
      email: String(data.get('email') ?? ''),
      from: String(data.get('from') ?? defaultFrom),
      to: String(data.get('to') ?? defaultTo),
      targetRate: Number(data.get('targetRate') ?? 0),
      direction: String(data.get('direction') ?? 'above'),
      consent: data.get('consent') === 'on',
    }

    try {
      const res = await fetch('/api/rate-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body?.error ?? 'Could not create the alert.')
      setStatus('success')
      setMessage(body?.message ?? 'Alert created.')
      form.reset()
    } catch (err) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : 'Could not create the alert.')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`rounded-3xl border border-white/10 bg-gray-900/60 ${compact ? 'p-6' : 'p-8'}`}
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400/10">
          <Bell className="h-5 w-5 text-emerald-400" />
        </div>
        <div>
          <h3 className="text-white font-semibold">Get rate alerts</h3>
          <p className="text-xs text-gray-400">
            We&apos;ll email you when the rate hits your target.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr,100px,100px]">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Email</label>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="w-full rounded-xl border border-white/10 bg-gray-950 px-3 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">From</label>
          <select
            name="from"
            defaultValue={defaultFrom}
            className="w-full rounded-xl border border-white/10 bg-gray-950 px-3 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none"
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">To</label>
          <select
            name="to"
            defaultValue={defaultTo}
            className="w-full rounded-xl border border-white/10 bg-gray-950 px-3 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none"
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-[160px,1fr]">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">When rate is</label>
          <select
            name="direction"
            defaultValue="above"
            className="w-full rounded-xl border border-white/10 bg-gray-950 px-3 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none"
          >
            <option value="above">At or above</option>
            <option value="below">At or below</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">
            Target rate (1 {defaultFrom} = ? {defaultTo})
          </label>
          <input
            name="targetRate"
            type="number"
            step="0.0001"
            min="0"
            required
            placeholder="e.g., 1600"
            className="w-full rounded-xl border border-white/10 bg-gray-950 px-3 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none"
          />
        </div>
      </div>

      <label className="mt-4 flex items-start gap-2 text-xs text-gray-400">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-0.5 h-4 w-4 rounded border-white/20 bg-gray-950 text-emerald-400 focus:ring-emerald-400"
        />
        <span>
          I agree to receive rate-alert emails. I can unsubscribe anytime with one click.
        </span>
      </label>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-gray-950 hover:bg-emerald-300 transition disabled:opacity-60"
      >
        <Bell className="h-4 w-4" />
        {status === 'submitting' ? 'Saving…' : 'Create alert'}
      </button>

      {status === 'success' && (
        <p className="mt-4 flex items-start gap-2 text-sm text-emerald-400">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          {message}
        </p>
      )}
      {status === 'error' && (
        <p className="mt-4 flex items-start gap-2 text-sm text-red-400">
          <AlertCircle className="h-5 w-5 shrink-0" />
          {message}
        </p>
      )}
    </form>
  )
}
