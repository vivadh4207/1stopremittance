import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { FaqAccordion } from '@/components/faq-accordion'
import { FAQ_SECTIONS, buildFaqJsonLd } from '@/lib/faqs'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | Remittance, Rates & Fees',
  description:
    'Answers to common questions about sending money abroad, exchange rates, fees, and how 1StopRemittance compares providers like Wise, Remitly, and Western Union.',
  alternates: {
    canonical: 'https://1stopremittance.com/faqs',
  },
  openGraph: {
    title: 'Frequently Asked Questions — 1StopRemittance',
    description:
      'Everything you need to know about comparing money transfer rates and sending money home.',
    url: 'https://1stopremittance.com/faqs',
    type: 'website',
  },
}

export default function FaqsPage() {
  const jsonLd = buildFaqJsonLd()

  return (
    <>
      {/* FAQPage schema — enables rich FAQ snippets in Google search results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="min-h-screen bg-gray-950 pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16">
            <span className="inline-block mb-4 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-medium text-emerald-400">
              Help Center
            </span>
            <h1 className="text-4xl font-bold text-white sm:text-5xl mb-4">
              Frequently Asked{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Questions
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Answers to the questions we hear most often about comparing remittance providers and sending money home.
            </p>
          </div>

          {/* Jump-to nav */}
          <nav
            aria-label="Jump to section"
            className="mb-12 flex flex-wrap gap-2 justify-center"
          >
            {FAQ_SECTIONS.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="rounded-full border border-white/10 bg-gray-900/60 px-4 py-1.5 text-xs font-medium text-gray-300 hover:border-emerald-400/40 hover:text-emerald-300 transition"
              >
                {section.title}
              </a>
            ))}
          </nav>

          {/* Sections */}
          <div className="space-y-12">
            {FAQ_SECTIONS.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-28">
                <h2 className="text-2xl font-bold text-white mb-6">{section.title}</h2>
                <FaqAccordion faqs={section.faqs} />
              </section>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-20 rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-400/10 to-cyan-400/10 p-10 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">Still have questions?</h2>
            <p className="text-gray-400 mb-6">
              Our team responds to every message within one business day.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-gray-950 hover:bg-emerald-300 transition"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
