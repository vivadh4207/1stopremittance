'use client'

import { useState, useRef, useEffect } from 'react'
import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Globe, Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { locales, localeNames, localeFlags, type Locale } from '@/i18n/config'

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const currentLocale = useLocale() as Locale
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function switchLocale(locale: Locale) {
    document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`
    setOpen(false)
    router.refresh()
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          'flex items-center gap-1.5 rounded-lg transition-colors',
          compact
            ? 'px-2 py-1.5 text-gray-400 hover:text-white'
            : 'border border-white/10 bg-gray-900/60 px-3 py-2 text-sm text-gray-300 hover:border-emerald-400/40 hover:text-white',
        )}
        aria-label="Change language"
      >
        <Globe className="h-4 w-4" />
        <span className="text-xs font-medium">
          {localeFlags[currentLocale]} {compact ? '' : localeNames[currentLocale]}
        </span>
        <ChevronDown className={cn('h-3 w-3 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-52 rounded-xl border border-white/10 bg-gray-900 py-1 shadow-2xl backdrop-blur-xl">
          {locales.map((locale) => (
            <button
              key={locale}
              type="button"
              onClick={() => switchLocale(locale)}
              className={cn(
                'flex w-full items-center gap-3 px-4 py-2.5 text-sm transition hover:bg-white/5',
                locale === currentLocale ? 'text-emerald-400' : 'text-gray-300',
              )}
            >
              <span className="text-base">{localeFlags[locale]}</span>
              <span className="flex-1 text-left font-medium">{localeNames[locale]}</span>
              {locale === currentLocale && (
                <Check className="h-4 w-4 text-emerald-400" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
