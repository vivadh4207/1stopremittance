'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  BarChart3,
  Globe2,
  DollarSign,
  Receipt,
  Percent,
  Gift,
  Users,
  ShieldCheck,
  ArrowLeftRight,
  Key,
  Settings,
  ChevronDown,
  ChevronRight,
  LogOut,
} from 'lucide-react'

interface NavItem {
  label: string
  href?: string
  icon: React.ElementType
  children?: { label: string; href: string; icon: React.ElementType }[]
}

const navItems: NavItem[] = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { label: 'Corridors', href: '/admin/corridors', icon: Globe2 },
  {
    label: 'Pricing',
    icon: DollarSign,
    children: [
      { label: 'Fees', href: '/admin/pricing?tab=fees', icon: Receipt },
      { label: 'FX Markup', href: '/admin/pricing?tab=fx', icon: Percent },
      { label: 'Promotions', href: '/admin/pricing?tab=promotions', icon: Gift },
    ],
  },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'KYC Review', href: '/admin/users?filter=kyc', icon: ShieldCheck },
  { label: 'Transactions', href: '/admin/transactions', icon: ArrowLeftRight },
  { label: 'API Keys', href: '/admin/api-keys', icon: Key },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>(['Pricing'])

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    )
  }

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href.split('?')[0])
  }

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-gradient-to-b from-indigo-950 to-purple-950 text-white">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-indigo-800/50">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-500 font-bold text-sm">
          1S
        </div>
        <div>
          <p className="font-semibold text-sm">1Stop Remittance</p>
          <p className="text-xs text-indigo-300">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          if (item.children) {
            const isExpanded = expandedItems.includes(item.label)
            const hasActiveChild = item.children.some((c) => isActive(c.href))
            return (
              <div key={item.label}>
                <button
                  onClick={() => toggleExpand(item.label)}
                  className={cn(
                    'flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    hasActiveChild
                      ? 'text-white bg-indigo-800/40'
                      : 'text-indigo-200 hover:text-white hover:bg-indigo-800/30'
                  )}
                >
                  <span className="flex items-center gap-3">
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </span>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
                {isExpanded && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                          isActive(child.href)
                            ? 'text-white bg-indigo-700/50 font-medium'
                            : 'text-indigo-300 hover:text-white hover:bg-indigo-800/30'
                        )}
                      >
                        <child.icon className="h-4 w-4" />
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          }

          return (
            <Link
              key={item.label}
              href={item.href!}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive(item.href!)
                  ? 'text-white bg-indigo-700/50 shadow-sm'
                  : 'text-indigo-200 hover:text-white hover:bg-indigo-800/30'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t border-indigo-800/50">
        <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-indigo-300 hover:text-white hover:bg-indigo-800/30 transition-colors">
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
