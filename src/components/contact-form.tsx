'use client'

import { useState } from 'react'
import { Send, CheckCircle2, AlertCircle } from 'lucide-react'

type Status = 'idle' | 'submitting' | 'success' | 'error'

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg('')

    const form = e.currentTarget
    const data = new FormData(form)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: String(data.get('name') ?? ''),
          email: String(data.get('email') ?? ''),
          topic: String(data.get('topic') ?? ''),
          message: String(data.get('message') ?? ''),
        }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.error ?? 'Could not send your message.')
      }
      setStatus('success')
      form.reset()
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Could not send your message.')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-white/10 bg-gray-900/40 p-8 space-y-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" name="name" type="text" required />
        <Field label="Email" name="email" type="email" required />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Topic
        </label>
        <select
          name="topic"
          required
          defaultValue=""
          className="w-full rounded-xl border border-white/10 bg-gray-950 px-4 py-3 text-sm text-white focus:border-emerald-400 focus:outline-none"
        >
          <option value="" disabled>
            Choose a topic…
          </option>
          <option value="rates">Rate or provider question</option>
          <option value="corridor">Suggest a corridor</option>
          <option value="bug">Report a bug</option>
          <option value="press">Press or partnership</option>
          <option value="other">Something else</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Message
        </label>
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={2000}
          rows={6}
          placeholder="How can we help?"
          className="w-full rounded-xl border border-white/10 bg-gray-950 px-4 py-3 text-sm text-white focus:border-emerald-400 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="inline-flex items-center gap-2 rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-gray-950 hover:bg-emerald-300 transition disabled:opacity-60"
      >
        <Send className="h-4 w-4" />
        {status === 'submitting' ? 'Sending…' : 'Send message'}
      </button>

      {status === 'success' && (
        <p className="flex items-start gap-2 text-sm text-emerald-400">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          Thanks — we got your message and will reply within one business day.
        </p>
      )}
      {status === 'error' && (
        <p className="flex items-start gap-2 text-sm text-red-400">
          <AlertCircle className="h-5 w-5 shrink-0" />
          {errorMsg}
        </p>
      )}
    </form>
  )
}

function Field({
  label,
  name,
  type,
  required,
}: {
  label: string
  name: string
  type: string
  required?: boolean
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        autoComplete={type === 'email' ? 'email' : 'off'}
        className="w-full rounded-xl border border-white/10 bg-gray-950 px-4 py-3 text-sm text-white focus:border-emerald-400 focus:outline-none"
      />
    </div>
  )
}
