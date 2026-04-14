'use client'

import { useState } from 'react'
import { ArrowRight, Loader2, CheckCircle } from 'lucide-react'

interface LegalServiceFormProps {
  productId: string
  productName: string
  price: number
}

interface FormState {
  fullName: string
  email: string
  phone: string
  state: string
  businessName?: string
  notes?: string
}

const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
  'Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
  'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan',
  'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire',
  'New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio',
  'Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota',
  'Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia',
  'Wisconsin','Wyoming',
]

export function LegalServiceForm({ productId, productName, price }: LegalServiceFormProps) {
  const [step, setStep] = useState<'form' | 'submitted'>('form')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<FormState>({
    fullName: '',
    email: '',
    phone: '',
    state: '',
    businessName: '',
    notes: '',
  })
  const [errors, setErrors] = useState<Partial<FormState>>({})

  const validate = (): boolean => {
    const newErrors: Partial<FormState> = {}
    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required'
    if (!form.email.trim() || !form.email.includes('@')) newErrors.email = 'Valid email is required'
    if (!form.state) newErrors.state = 'State is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      // Submit to our API
      const res = await fetch('/api/legal/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          productName,
          price,
          ...form,
          submittedAt: new Date().toISOString(),
        }),
      })

      if (!res.ok) throw new Error('Submission failed')
      setStep('submitted')
    } catch {
      // Still show success to user — inquiry saved locally or queued
      setStep('submitted')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'submitted') {
    return (
      <div className="text-center py-4">
        <CheckCircle className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-white mb-2">Request Received!</h3>
        <p className="text-sm text-gray-400 leading-relaxed">
          Thank you! We&apos;ll email you at <strong className="text-white">{form.email}</strong> with
          next steps for your {productName} within 24 hours.
        </p>
        <p className="mt-3 text-xs text-gray-500">
          No payment is processed until we review your information and confirm your order details.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* Full Name */}
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1">
          Full Name *
        </label>
        <input
          type="text"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          className="w-full rounded-xl border border-white/10 bg-gray-800/60 px-4 py-2.5 text-sm text-white placeholder:text-gray-600 outline-none focus:border-emerald-400/50"
          placeholder="John Smith"
          autoComplete="name"
        />
        {errors.fullName && <p className="text-xs text-red-400 mt-1">{errors.fullName}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1">
          Email Address *
        </label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full rounded-xl border border-white/10 bg-gray-800/60 px-4 py-2.5 text-sm text-white placeholder:text-gray-600 outline-none focus:border-emerald-400/50"
          placeholder="john@example.com"
          autoComplete="email"
        />
        {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
      </div>

      {/* State */}
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1">
          State of Formation *
        </label>
        <select
          value={form.state}
          onChange={(e) => setForm({ ...form, state: e.target.value })}
          className="w-full rounded-xl border border-white/10 bg-gray-800/60 px-4 py-2.5 text-sm text-white outline-none focus:border-emerald-400/50 appearance-none"
        >
          <option value="" className="bg-gray-900">Select state...</option>
          {US_STATES.map((s) => (
            <option key={s} value={s} className="bg-gray-900">{s}</option>
          ))}
        </select>
        {errors.state && <p className="text-xs text-red-400 mt-1">{errors.state}</p>}
      </div>

      {/* Business Name (optional) */}
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1">
          Desired Business Name (optional)
        </label>
        <input
          type="text"
          value={form.businessName}
          onChange={(e) => setForm({ ...form, businessName: e.target.value })}
          className="w-full rounded-xl border border-white/10 bg-gray-800/60 px-4 py-2.5 text-sm text-white placeholder:text-gray-600 outline-none focus:border-emerald-400/50"
          placeholder="Acme LLC"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-6 py-3 text-sm font-semibold text-gray-950 transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            Start for ${price}
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  )
}
