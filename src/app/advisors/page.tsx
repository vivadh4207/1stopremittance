'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { getAllAdvisors, type Advisor } from '@/lib/advisors'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import {
  Star,
  MapPin,
  Globe,
  Mail,
  Phone,
  BadgeCheck,
  ArrowRight,
  Search,
  Award,
  Crown,
} from 'lucide-react'

function AdvisorCard({ advisor }: { advisor: Advisor }) {
  const [showContact, setShowContact] = useState(false)
  const initials = advisor.name.split(' ').map((n) => n[0]).join('')

  return (
    <div className={cn(
      'bg-gray-900/50 border rounded-2xl p-6 transition-colors',
      advisor.tier === 'premium' ? 'border-emerald-400/30' :
      advisor.tier === 'pro' ? 'border-cyan-400/20' : 'border-white/10'
    )}>
      {/* Tier badge */}
      {advisor.tier !== 'basic' && (
        <div className="flex justify-end mb-2">
          <span className={cn(
            'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold',
            advisor.tier === 'premium'
              ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900'
              : 'bg-cyan-400/10 text-cyan-400 border border-cyan-400/20'
          )}>
            {advisor.tier === 'premium' ? <Crown className="h-3 w-3" /> : <Award className="h-3 w-3" />}
            {advisor.tier === 'premium' ? 'Premium' : 'Pro'}
          </span>
        </div>
      )}

      {/* Profile header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 text-lg font-bold text-gray-900 flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white truncate">{advisor.name}</h3>
            {advisor.verified && <BadgeCheck className="h-4 w-4 text-emerald-400 flex-shrink-0" />}
          </div>
          <p className="text-sm text-gray-400">{advisor.title}</p>
          <div className="flex items-center gap-3 mt-1">
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
              <span className="text-sm text-yellow-400 font-medium">{advisor.rating}</span>
              <span className="text-xs text-gray-500">({advisor.reviewCount})</span>
            </div>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {advisor.location}
            </span>
          </div>
        </div>
      </div>

      {/* Bio */}
      <p className="text-sm text-gray-400 leading-relaxed mb-4 line-clamp-3">{advisor.bio}</p>

      {/* Specialties */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {advisor.specialties.slice(0, 4).map((s) => (
          <span key={s} className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-300">
            {s}
          </span>
        ))}
      </div>

      {/* Languages & Experience */}
      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
        <span>🗣 {advisor.languages.join(', ')}</span>
        <span>{advisor.yearsExperience}+ years exp.</span>
      </div>

      {/* Contact */}
      {showContact ? (
        <div className="space-y-2 p-3 bg-white/5 rounded-xl">
          <a href={`mailto:${advisor.contactEmail}`} className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300">
            <Mail className="h-4 w-4" /> {advisor.contactEmail}
          </a>
          {advisor.phone && (
            <a href={`tel:${advisor.phone}`} className="flex items-center gap-2 text-sm text-gray-300 hover:text-white">
              <Phone className="h-4 w-4" /> {advisor.phone}
            </a>
          )}
          {advisor.website && (
            <a href={advisor.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-300 hover:text-white">
              <Globe className="h-4 w-4" /> Website
            </a>
          )}
        </div>
      ) : (
        <button
          onClick={() => setShowContact(true)}
          className="w-full py-2.5 bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900 font-bold rounded-xl text-sm hover:opacity-90 transition-opacity"
        >
          Contact Advisor
        </button>
      )}
    </div>
  )
}

export default function AdvisorsPage() {
  const [search, setSearch] = useState('')
  const [corridorFilter, setCotridorFilter] = useState('all')
  const allAdvisors = getAllAdvisors()

  const corridors = [
    { value: 'all', label: 'All Corridors' },
    { value: 'usd-to-ngn', label: '🇳🇬 Nigeria' },
    { value: 'usd-to-php', label: '🇵🇭 Philippines' },
    { value: 'usd-to-ghs', label: '🇬🇭 Ghana' },
    { value: 'usd-to-kes', label: '🇰🇪 Kenya' },
    { value: 'usd-to-mxn', label: '🇲🇽 Mexico' },
    { value: 'usd-to-inr', label: '🇮🇳 India' },
  ]

  const filtered = allAdvisors.filter((a) => {
    const matchesSearch = search === '' ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.specialties.some((s) => s.toLowerCase().includes(search.toLowerCase()))
    const matchesCorridor = corridorFilter === 'all' || a.corridors.includes(corridorFilter)
    return matchesSearch && matchesCorridor
  })

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-950 pt-28 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-14">
            <span className="inline-block mb-4 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-medium text-emerald-400">
              Expert Help
            </span>
            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              Remittance{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Advisors
              </span>
            </h1>
            <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
              Connect with verified remittance specialists who help Nigerian and Filipino diaspora save money on every transfer.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-10">
            <div className="flex items-center gap-3 bg-gray-900/50 border border-white/10 rounded-xl px-4 py-3 flex-1 max-w-md w-full">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or specialty..."
                className="flex-1 bg-transparent text-white outline-none placeholder:text-gray-500 text-sm"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {corridors.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setCotridorFilter(c.value)}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium transition-all',
                    corridorFilter === c.value
                      ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                  )}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Advisor grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-16">
            {filtered.map((advisor) => (
              <AdvisorCard key={advisor.id} advisor={advisor} />
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-400">No advisors found matching your criteria.</p>
              </div>
            )}
          </div>

          {/* Become an advisor CTA */}
          <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-400/20 rounded-3xl p-8 sm:p-12 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">
              Are You a Remittance Advisor?
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto mb-6">
              Join 1StopRemittance and reach thousands of Nigerian and Filipino diaspora members looking for expert help with their transfers.
            </p>
            <Link
              href="/advisors/join"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900 font-bold rounded-full text-sm"
            >
              Become a Listed Advisor <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="mt-3 text-xs text-gray-500">Plans start at $29/month. Cancel anytime.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
