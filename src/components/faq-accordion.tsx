'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { FAQ } from '@/lib/faqs'

interface Props {
  faqs: FAQ[]
}

export function FaqAccordion({ faqs }: Props) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <ul className="space-y-3">
      {faqs.map((faq, idx) => {
        const isOpen = open === idx
        return (
          <li
            key={faq.q}
            className="rounded-2xl border border-white/10 bg-gray-900/40 overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : idx)}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-white/5 transition"
              aria-expanded={isOpen}
            >
              <span className="text-base font-semibold text-white">{faq.q}</span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-gray-400 transition-transform ${
                  isOpen ? 'rotate-180 text-emerald-400' : ''
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-5 pb-5 pt-0">
                <p className="text-sm leading-relaxed text-gray-300">{faq.a}</p>
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
