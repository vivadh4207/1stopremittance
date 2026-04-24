import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { SearchInterface } from '@/components/search-interface'

export const metadata: Metadata = {
  title: 'Public Information Search | 1StopRemittance',
  description: 'Search our database of public government information about business formation, remittance regulations, tax IDs, and immigrant entrepreneur resources.',
  keywords: 'public government information, business filing information, EIN information, LLC guide, remittance regulations, IRS information, SBA resources',
}

export default function SearchPage() {
  return (
    <>
      <Navbar />
      <main className="bg-gray-950 text-white min-h-screen pt-24 pb-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="inline-block mb-4 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-medium text-emerald-400">
              Public Information Database
            </span>
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
              Search Government &amp; Legal Resources
            </h1>
            <p className="mt-4 text-gray-400 max-w-xl mx-auto">
              Get answers from official government sources — IRS, SBA, CFPB, USCIS, and more.
              All information is publicly available and sourced from official websites.
            </p>
          </div>

          <Suspense fallback={<div className="text-gray-400 text-center py-10">Loading search...</div>}>
            <SearchInterface />
          </Suspense>

          {/* Data sources */}
          <div className="mt-12 rounded-2xl border border-white/10 bg-gray-900/50 p-6">
            <h2 className="text-base font-semibold text-white mb-4">Official Sources We Cite</h2>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {[
                { name: 'IRS.gov', desc: 'Tax ID numbers, EINs, tax forms', url: 'https://irs.gov' },
                { name: 'SBA.gov', desc: 'Business formation, loans, resources', url: 'https://sba.gov' },
                { name: 'CFPB', desc: 'Remittance regulations, consumer rights', url: 'https://consumerfinance.gov' },
                { name: 'USCIS.gov', desc: 'Immigration, visas, entrepreneur programs', url: 'https://uscis.gov' },
                { name: 'USPTO.gov', desc: 'Trademarks, patents, intellectual property', url: 'https://uspto.gov' },
                { name: 'FinCEN.gov', desc: 'Money services, financial regulations', url: 'https://fincen.gov' },
              ].map((source) => (
                <a
                  key={source.name}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 rounded-xl border border-white/10 bg-gray-800/50 p-3 hover:border-emerald-400/30 transition-colors group"
                >
                  <div className="h-8 w-8 rounded-lg bg-emerald-400/10 flex items-center justify-center shrink-0 text-xs font-bold text-emerald-400">
                    {source.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white group-hover:text-emerald-400 transition-colors">
                      {source.name}
                    </p>
                    <p className="text-xs text-gray-500">{source.desc}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
