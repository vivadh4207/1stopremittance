'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { registerSchema } from '@/lib/validation'
import { SEND_COUNTRIES, RECEIVE_COUNTRIES } from '@/lib/countries'

const allCountries = [...SEND_COUNTRIES, ...RECEIVE_COUNTRIES]
  .filter((c, i, arr) => arr.findIndex((x) => x.id === c.id) === i)
  .sort((a, b) => a.name.localeCompare(b.name))

const countryOptions = [
  { value: '', label: 'Select your country' },
  ...allCountries.map((c) => ({
    value: c.id,
    label: `${c.flagEmoji} ${c.name}`,
  })),
]

export default function RegisterPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    country: '',
    phone: '',
    referralCode: '',
  })
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError('')
    setFieldErrors({})

    const payload = {
      ...form,
      phone: form.phone || undefined,
      referralCode: form.referralCode || undefined,
    }

    const result = registerSchema.safeParse(payload)
    if (!result.success) {
      const errors: Record<string, string> = {}
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string
        errors[field] = issue.message
      })
      setFieldErrors(errors)
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        setFormError(data.error || 'Registration failed. Please try again.')
        return
      }

      // Auto sign in after registration
      const signInRes = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      })

      if (signInRes?.error) {
        router.push('/login')
      } else {
        router.push('/dashboard')
      }
    } catch {
      setFormError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Create your account</CardTitle>
        <CardDescription>
          Start sending money with the best rates
        </CardDescription>
      </CardHeader>
      <CardContent>
        {formError && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First name"
              placeholder="John"
              value={form.firstName}
              onChange={(e) => updateField('firstName', e.target.value)}
              error={fieldErrors.firstName}
              autoComplete="given-name"
              required
            />
            <Input
              label="Last name"
              placeholder="Doe"
              value={form.lastName}
              onChange={(e) => updateField('lastName', e.target.value)}
              error={fieldErrors.lastName}
              autoComplete="family-name"
              required
            />
          </div>

          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => updateField('email', e.target.value)}
            error={fieldErrors.email}
            autoComplete="email"
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="At least 8 characters"
            value={form.password}
            onChange={(e) => updateField('password', e.target.value)}
            error={fieldErrors.password}
            autoComplete="new-password"
            required
          />

          <Select
            label="Country"
            options={countryOptions}
            value={form.country}
            onChange={(e) => updateField('country', e.target.value)}
            error={fieldErrors.country}
          />

          <Input
            label="Phone number (optional)"
            type="tel"
            placeholder="+1 (555) 123-4567"
            value={form.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            error={fieldErrors.phone}
            autoComplete="tel"
          />

          <Input
            label="Referral code (optional)"
            placeholder="Enter referral code"
            value={form.referralCode}
            onChange={(e) => updateField('referralCode', e.target.value)}
            error={fieldErrors.referralCode}
          />

          <Button type="submit" className="w-full" size="lg" loading={loading}>
            Create account
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-gray-500">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
