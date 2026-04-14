'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Search, ExternalLink, ArrowRight, Loader2, BookOpen, Briefcase } from 'lucide-react'

interface InfoResult {
  type: 'info'
  id: string
  title: string
  summary: string
  source: string
  sourceUrl: string
  category: string
}

interface ServiceResult {
  type: 'service'
  id: string
  title: string
  summary: string
  price: number
  slug: string
  icon: string
}

type SearchResult = InfoResult | ServiceResult

export function SearchInterface() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQuery)
  const [inputValue, setInputValue] = useState(initialQuery)
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const doSearch = useCallback(async (q: string) => {
    setLoading(true)
    setHasSearched(true)
    try {
      const res = await fetch(`/api/legal/search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setResults(data.results || [])
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Run initial search if query param provided
  useEffect(() => {
    if (initialQuery) {
      doSearch(initialQuery)
    } else {
      // Load all topics
      doSearch('')
    }
  }, [initialQuery, doSearch])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setQuery(inputValue)
    doSearch(inputValue)
    // Update URL without page reload
    const url = new URL(window.location.href)
    url.searchParams.set('q', inputValue)
    window.history.pushState({}, '', url)
  }

  const popular = [
    'How to form an LLC',
    'What is an EIN',
    'Remittance regulations',
    'Immigrant business rights',
    'Trademark registration',
  ]

  return (
    <div>
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative">
        <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-gray-900/70 backdrop-blur-xl px-5 py-4 focus-within:border-emerald-400/50 transition-colors">
          <Search className="h-5 w-5 text-gray-400 shrink-0" />
          <input
            type="search"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search public government information... (e.g., 'how to get an EIN', 'LLC requirements')"
            className="flex-1 bg-transparent text-white placeholder:text-gray-500 outline-none text-base"
            autoFocus
            aria-label="Search public information"
          />
          <button
            type="submit"
            className="shrink-0 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-5 py-2 text-sm font-semibold text-gray-950 hover:opacity-90 transition-opacity"
          >
            Search
          </button>
        </div>
      </form>

      {/* Popular Searches */}
      {!hasSearched && (
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-xs text-gray-500 self-center">Popular:</span>
          {popular.map((term) => (
            <button
              key={term}
              onClick={() => {
                setInputValue(term)
                setQuery(term)
                doSearch(term)
              }}
              className="text-xs rounded-full border border-white/15 bg-gray-800/60 px-3 py-1.5 text-gray-300 hover:border-emerald-400/40 hover:text-white transition-colors"
            >
              {term}
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      <div className="mt-8">
        {loading && (
          <div className="flex items-center justify-center py-16 gap-3 text-gray-400">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Searching public information database...</span>
          </div>
        )}

        {!loading && hasSearched && results.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No results found for &ldquo;{query}&rdquo;</p>
            <p className="text-gray-500 text-sm mt-2">
              Try different keywords or browse our{' '}
              <Link href="/legal-services" className="text-emerald-400 hover:underline">services</Link>.
            </p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="space-y-6">
            {/* Info Results */}
            {results.filter((r) => r.type === 'info').length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-gray-300">
                  <BookOpen className="h-4 w-4 text-emerald-400" />
                  Public Information ({results.filter((r) => r.type === 'info').length} results)
                </div>
                <div className="space-y-4">
                  {results.filter((r): r is InfoResult => r.type === 'info').map((result) => (
                    <div
                      key={result.id}
                      className="rounded-2xl border border-white/10 bg-gray-900/50 p-5 hover:border-emerald-400/20 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <span className="text-xs text-emerald-400 font-medium uppercase tracking-wide">
                            {result.category}
                          </span>
                          <h3 className="text-base font-bold text-white mt-1">{result.title}</h3>
                          <p className="text-sm text-gray-400 mt-2 leading-relaxed">{result.summary}</p>
                          <div className="mt-3 flex items-center gap-2">
                            <a
                              href={result.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-emerald-400 transition-colors"
                            >
                              <ExternalLink className="h-3 w-3" />
                              Source: {result.source}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Service Results */}
            {results.filter((r) => r.type === 'service').length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-gray-300">
                  <Briefcase className="h-4 w-4 text-cyan-400" />
                  Related Services ({results.filter((r) => r.type === 'service').length} results)
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {results.filter((r): r is ServiceResult => r.type === 'service').map((result) => (
                    <Link
                      key={result.id}
                      href={`/legal-services/${result.slug}`}
                      className="group rounded-2xl border border-white/10 bg-gray-900/50 p-5 hover:border-emerald-400/30 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">{result.icon}</span>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                            {result.title}
                          </h3>
                          <p className="text-sm text-gray-400 mt-1">{result.summary}</p>
                          <p className="text-lg font-bold text-emerald-400 mt-2">
                            ${result.price}
                            <span className="text-xs text-gray-500 font-normal ml-1">+ fees</span>
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-500 group-hover:text-emerald-400 transition-colors mt-1" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
