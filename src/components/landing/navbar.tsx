'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Globe, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="bg-slate-900/95 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Globe className="h-7 w-7 text-blue-400" />
            <span className="text-xl font-bold text-white">1StopRemittance</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/pricing" className="text-sm text-gray-300 hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="/help" className="text-sm text-gray-300 hover:text-white transition-colors">
              Help
            </Link>
            <Link href="/login">
              <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10">
                Log In
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Sign Up Free
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-gray-300 hover:text-white"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden py-4 space-y-3 border-t border-white/10">
            <Link href="/pricing" className="block text-gray-300 hover:text-white py-2">Pricing</Link>
            <Link href="/help" className="block text-gray-300 hover:text-white py-2">Help</Link>
            <Link href="/login" className="block">
              <Button variant="outline" className="w-full border-gray-600 text-gray-300">Log In</Button>
            </Link>
            <Link href="/register" className="block">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Sign Up Free</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
