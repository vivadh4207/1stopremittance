'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { formatCurrency } from '@/lib/utils'
import { Search, Download, Users, Eye } from 'lucide-react'

const kycStatusVariant: Record<string, 'success' | 'warning' | 'destructive' | 'default' | 'secondary'> = {
  verified: 'success',
  pending: 'warning',
  rejected: 'destructive',
  submitted: 'default',
  'not started': 'secondary',
}

const tierColors: Record<string, string> = {
  Free: 'bg-gray-100 text-gray-700',
  Basic: 'bg-blue-100 text-blue-700',
  Premium: 'bg-purple-100 text-purple-700',
  Business: 'bg-indigo-100 text-indigo-700',
}

const users = [
  { id: '1', name: 'Rajesh Kumar', email: 'rajesh.kumar@gmail.com', country: 'United States', kyc: 'verified', tier: 'Premium', transfers: 47, volume: 52340, joined: '2024-08-15' },
  { id: '2', name: 'Maria Santos', email: 'maria.santos@yahoo.com', country: 'United States', kyc: 'verified', tier: 'Basic', transfers: 23, volume: 18400, joined: '2025-01-22' },
  { id: '3', name: 'Ahmed Hassan', email: 'ahmed.h@outlook.com', country: 'United Kingdom', kyc: 'verified', tier: 'Premium', transfers: 65, volume: 87650, joined: '2024-05-10' },
  { id: '4', name: 'Carlos Mendez', email: 'carlos.m@gmail.com', country: 'United States', kyc: 'pending', tier: 'Free', transfers: 2, volume: 850, joined: '2026-04-01' },
  { id: '5', name: 'Priya Deshmukh', email: 'priya.d@gmail.com', country: 'Canada', kyc: 'verified', tier: 'Business', transfers: 124, volume: 234500, joined: '2024-03-18' },
  { id: '6', name: 'James Okonkwo', email: 'james.o@hotmail.com', country: 'United Kingdom', kyc: 'submitted', tier: 'Free', transfers: 0, volume: 0, joined: '2026-04-10' },
  { id: '7', name: 'Li Wei Chen', email: 'liwei.chen@gmail.com', country: 'Australia', kyc: 'verified', tier: 'Basic', transfers: 15, volume: 12300, joined: '2025-06-05' },
  { id: '8', name: 'Fatima Al-Rashid', email: 'fatima.r@gmail.com', country: 'Canada', kyc: 'rejected', tier: 'Free', transfers: 0, volume: 0, joined: '2026-03-25' },
  { id: '9', name: 'David Park', email: 'david.park@gmail.com', country: 'United States', kyc: 'verified', tier: 'Premium', transfers: 38, volume: 45200, joined: '2024-11-02' },
  { id: '10', name: 'Anika Sharma', email: 'anika.s@yahoo.com', country: 'United Kingdom', kyc: 'verified', tier: 'Basic', transfers: 9, volume: 7800, joined: '2025-09-14' },
  { id: '11', name: 'Emmanuel Adeyemi', email: 'emmanuel.a@gmail.com', country: 'United States', kyc: 'pending', tier: 'Free', transfers: 1, volume: 500, joined: '2026-04-05' },
  { id: '12', name: 'Sophie Nguyen', email: 'sophie.n@outlook.com', country: 'Australia', kyc: 'verified', tier: 'Premium', transfers: 52, volume: 67800, joined: '2024-07-20' },
  { id: '13', name: 'Roberto Garcia', email: 'roberto.g@gmail.com', country: 'United States', kyc: 'not started', tier: 'Free', transfers: 0, volume: 0, joined: '2026-04-12' },
  { id: '14', name: 'Meera Patel', email: 'meera.p@gmail.com', country: 'Canada', kyc: 'verified', tier: 'Business', transfers: 89, volume: 156700, joined: '2024-04-22' },
  { id: '15', name: 'John Williams', email: 'john.w@hotmail.com', country: 'United Kingdom', kyc: 'verified', tier: 'Basic', transfers: 11, volume: 9500, joined: '2025-11-30' },
]

export default function UsersPage() {
  const [search, setSearch] = useState('')
  const [kycFilter, setKycFilter] = useState('all')
  const [tierFilter, setTierFilter] = useState('all')

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    const matchesKyc = kycFilter === 'all' || u.kyc === kycFilter
    const matchesTier = tierFilter === 'all' || u.tier === tierFilter
    return matchesSearch && matchesKyc && matchesTier
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-sm text-gray-500 mt-1">{users.length} total users</p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export Users
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-600" />
              All Users
            </CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-9"
                />
              </div>
              <Select
                value={kycFilter}
                onChange={(e) => setKycFilter(e.target.value)}
                options={[
                  { value: 'all', label: 'All KYC' },
                  { value: 'verified', label: 'Verified' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'submitted', label: 'Submitted' },
                  { value: 'rejected', label: 'Rejected' },
                  { value: 'not started', label: 'Not Started' },
                ]}
                className="h-9 w-36"
              />
              <Select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                options={[
                  { value: 'all', label: 'All Tiers' },
                  { value: 'Free', label: 'Free' },
                  { value: 'Basic', label: 'Basic' },
                  { value: 'Premium', label: 'Premium' },
                  { value: 'Business', label: 'Business' },
                ]}
                className="h-9 w-36"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Name</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Email</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Country</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500">KYC Status</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Tier</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-500">Transfers</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-500">Volume</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Joined</th>
                  <th className="text-center py-3 px-2 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center h-7 w-7 rounded-full bg-indigo-100 text-indigo-600 text-xs font-medium">
                          {user.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <span className="font-medium text-gray-900">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-gray-600">{user.email}</td>
                    <td className="py-3 px-2 text-gray-600">{user.country}</td>
                    <td className="py-3 px-2">
                      <Badge variant={kycStatusVariant[user.kyc]}>{user.kyc}</Badge>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${tierColors[user.tier]}`}>
                        {user.tier}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right text-gray-600">{user.transfers}</td>
                    <td className="py-3 px-2 text-right text-gray-600">
                      {user.volume > 0 ? formatCurrency(user.volume, 'USD') : '--'}
                    </td>
                    <td className="py-3 px-2 text-gray-600">{user.joined}</td>
                    <td className="py-3 px-2 text-center">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Showing {filtered.length} of {users.length} users
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
