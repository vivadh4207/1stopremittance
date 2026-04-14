'use client'

import Link from 'next/link'
import { Send, Mail, Globe, MessageCircle, Rss, Share2 } from 'lucide-react'

const companyLinks = [
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/careers', label: 'Careers' },
]

const resourceLinks = [
  { href: '/guides', label: 'Guides' },
  { href: '/blog', label: 'Blog' },
  { href: '/faqs', label: 'FAQs' },
]

const corridorLinks = [
  { href: '/corridors/usd-to-ngn', label: 'USD to NGN' },
  { href: '/corridors/usd-to-php', label: 'USD to PHP' },
  { href: '/corridors/usd-to-inr', label: 'USD to INR' },
  { href: '/corridors/usd-to-ghs', label: 'USD to GHS' },
]

const socialLinks = [
  { href: 'https://facebook.com', icon: Share2, label: 'Facebook' },
  { href: 'https://twitter.com', icon: MessageCircle, label: 'Twitter' },
  { href: 'https://instagram.com', icon: Rss, label: 'Instagram' },
  { href: 'https://youtube.com', icon: Globe, label: 'YouTube' },
]

export function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Top Section */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand + Newsletter */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <Send className="h-6 w-6 stroke-emerald-400" />
              <span className="text-xl font-bold">
                <span className="text-white">1Stop</span>
                <span className="text-emerald-400">Remittance</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 max-w-sm">
              Compare remittance rates from top providers. Find the best
              exchange rates, lowest fees, and fastest transfers for sending
              money abroad.
            </p>

            {/* Newsletter */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-white">
                Get rate alerts
              </h4>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex gap-2"
              >
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full rounded-lg border border-white/10 bg-gray-900/50 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-gray-500 focus:border-emerald-400/50 focus:outline-none focus:ring-1 focus:ring-emerald-400/50"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-lg bg-gradient-to-r from-emerald-400 to-cyan-400 px-4 py-2.5 text-sm font-semibold text-gray-950 transition-opacity hover:opacity-90"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white">Company</h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white">Resources</h4>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Corridors */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white">Corridors</h4>
            <ul className="space-y-3">
              {corridorLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-10 border-t border-white/10" />

        {/* Bottom Section */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <p className="text-xs text-gray-500">
              1StopRemittance earns commissions from partner links. This does
              not affect our rankings or recommendations.
            </p>
            <p className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} 1StopRemittance. All rights
              reserved.
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-gray-900/50 text-gray-400 transition-colors hover:border-emerald-400/50 hover:text-emerald-400"
              >
                <social.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
