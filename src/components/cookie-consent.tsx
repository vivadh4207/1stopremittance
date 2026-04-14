'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X, Cookie, ChevronDown, ChevronUp } from 'lucide-react'

type ConsentChoice = {
  necessary: true        // always required
  analytics: boolean
  marketing: boolean
  preferences: boolean
}

const STORAGE_KEY = '1stop_cookie_consent'
const CONSENT_VERSION = '1.0'

function loadConsent(): (ConsentChoice & { version: string }) | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed.version !== CONSENT_VERSION) return null
    return parsed
  } catch {
    return null
  }
}

function saveConsent(choice: ConsentChoice) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...choice, version: CONSENT_VERSION }))
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [choices, setChoices] = useState<ConsentChoice>({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: true,
  })

  const applyConsent = (consent: ConsentChoice) => {
    // In production these would initialize actual tracking scripts
    if (typeof window === 'undefined') return
    // Google Analytics / gtag
    if (consent.analytics && (window as Window & { gtag?: (cmd: string, target: string, params: Record<string, string>) => void }).gtag) {
      // gtag('consent', 'update', { analytics_storage: 'granted' })
    }
    // Marketing pixels
    if (consent.marketing) {
      // Meta Pixel, etc. would be initialized here
    }
  }

  useEffect(() => {
    const existing = loadConsent()
    if (!existing) {
      // Delay showing the banner slightly for UX
      const timer = setTimeout(() => setVisible(true), 2000)
      return () => clearTimeout(timer)
    }
    // Apply saved choices
    applyConsent(existing)
  }, []) // applyConsent intentionally omitted - stable function, no deps needed

  const handleAcceptAll = () => {
    const all: ConsentChoice = { necessary: true, analytics: true, marketing: true, preferences: true }
    setChoices(all)
    saveConsent(all)
    applyConsent(all)
    setVisible(false)
  }

  const handleDeclineAll = () => {
    const minimal: ConsentChoice = { necessary: true, analytics: false, marketing: false, preferences: false }
    setChoices(minimal)
    saveConsent(minimal)
    setVisible(false)
  }

  const handleSavePreferences = () => {
    saveConsent(choices)
    applyConsent(choices)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[100] p-4 sm:p-6"
      role="dialog"
      aria-label="Cookie consent"
      aria-modal="true"
    >
      <div className="mx-auto max-w-4xl rounded-2xl border border-white/15 bg-gray-900/95 backdrop-blur-2xl shadow-2xl p-5 sm:p-6">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="shrink-0 hidden sm:flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10">
            <Cookie className="h-5 w-5 text-emerald-400" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-white">We use cookies 🍪</h2>
                <p className="mt-1 text-sm text-gray-400 leading-relaxed">
                  We use cookies to improve your experience, analyze traffic, and show relevant content.
                  You can choose which categories to allow.{' '}
                  <Link href="/privacy" className="text-emerald-400 hover:underline">
                    Privacy Policy
                  </Link>
                </p>
              </div>
              <button
                onClick={handleDeclineAll}
                className="shrink-0 text-gray-500 hover:text-white transition-colors"
                aria-label="Decline all and close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Cookie category details */}
            {showDetails && (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  {
                    key: 'necessary' as const,
                    label: '🔒 Strictly Necessary',
                    desc: 'Essential for the website to function. Cannot be disabled.',
                    locked: true,
                  },
                  {
                    key: 'preferences' as const,
                    label: '⚙️ Preferences',
                    desc: 'Remember your settings like currency selection and language.',
                    locked: false,
                  },
                  {
                    key: 'analytics' as const,
                    label: '📊 Analytics',
                    desc: 'Help us understand how visitors use the site (Google Analytics).',
                    locked: false,
                  },
                  {
                    key: 'marketing' as const,
                    label: '📢 Marketing',
                    desc: 'Enable personalized ads and conversion tracking.',
                    locked: false,
                  },
                ].map(({ key, label, desc, locked }) => (
                  <div
                    key={key}
                    className="flex items-start gap-3 rounded-xl border border-white/10 bg-gray-800/60 p-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white">{label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                    </div>
                    <div className="shrink-0 mt-1">
                      {locked ? (
                        <span className="text-xs text-gray-500 font-medium">Always On</span>
                      ) : (
                        <button
                          type="button"
                          role="switch"
                          aria-checked={choices[key]}
                          onClick={() => setChoices((c) => ({ ...c, [key]: !c[key] }))}
                          className={`relative inline-flex h-5 w-9 cursor-pointer rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400 ${
                            choices[key] ? 'bg-emerald-400' : 'bg-gray-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform mt-0.5 ${
                              choices[key] ? 'translate-x-4' : 'translate-x-0.5'
                            }`}
                          />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={handleAcceptAll}
                className="inline-flex items-center rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 px-5 py-2 text-sm font-semibold text-gray-950 transition-opacity hover:opacity-90"
              >
                Accept All
              </button>
              {showDetails ? (
                <button
                  onClick={handleSavePreferences}
                  className="inline-flex items-center rounded-full border border-emerald-400/40 px-5 py-2 text-sm font-semibold text-emerald-400 hover:bg-emerald-400/10 transition-colors"
                >
                  Save Preferences
                </button>
              ) : null}
              <button
                onClick={handleDeclineAll}
                className="inline-flex items-center rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-gray-300 hover:bg-white/5 transition-colors"
              >
                Decline All
              </button>
              <button
                onClick={() => setShowDetails((v) => !v)}
                className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors ml-auto"
              >
                {showDetails ? (
                  <>Fewer options <ChevronUp className="h-4 w-4" /></>
                ) : (
                  <>Customize <ChevronDown className="h-4 w-4" /></>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
