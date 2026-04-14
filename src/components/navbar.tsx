'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Send, Menu, X, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/compare', label: 'Compare Rates' },
  { href: '/corridors', label: 'Corridors' },
  { href: '/legal-services', label: 'Business Services', badge: 'New' },
  { href: '/guides', label: 'Guides' },
  { href: '/search', label: 'Search', icon: true },
  { href: '/about', label: 'About' },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-gray-950/90 backdrop-blur-xl border-b border-white/10'
          : 'bg-transparent'
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Send className="h-6 w-6 text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text stroke-emerald-400" />
          <span className="text-xl font-bold">
            <span className="text-white">1Stop</span>
            <span className="text-emerald-400">Remittance</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative text-sm text-gray-400 transition-colors hover:text-white flex items-center gap-1"
            >
              {link.icon && <Search className="h-3.5 w-3.5" />}
              {link.label}
              {link.badge && (
                <span className="ml-1 rounded-full bg-emerald-400 px-1.5 py-0.5 text-[9px] font-bold text-gray-950 uppercase">
                  {link.badge}
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Link
            href="/compare"
            className="inline-flex items-center rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 px-5 py-2 text-sm font-semibold text-gray-950 transition-opacity hover:opacity-90"
          >
            Compare Now
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden text-gray-400 hover:text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-950/95 backdrop-blur-xl border-b border-white/10">
          <div className="flex flex-col gap-4 px-6 py-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 text-gray-400 transition-colors hover:text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.icon && <Search className="h-4 w-4" />}
                {link.label}
                {link.badge && (
                  <span className="rounded-full bg-emerald-400 px-1.5 py-0.5 text-[9px] font-bold text-gray-950 uppercase">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
            <Link
              href="/compare"
              className="mt-2 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 px-5 py-2.5 text-sm font-semibold text-gray-950 transition-opacity hover:opacity-90"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Compare Now
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
