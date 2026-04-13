'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  User,
  Lock,
  Bell,
  Shield,
  CreditCard,
  Check,
  ChevronRight,
  Crown,
  Zap,
  Star,
} from 'lucide-react'

const subscriptionTiers = [
  {
    id: 'FREE',
    name: 'Free',
    price: '$0/mo',
    current: true,
    features: ['$2,500 daily limit', 'Standard rates', 'Basic support', '1x reward points'],
    icon: Zap,
    color: 'gray',
  },
  {
    id: 'PLUS',
    name: 'Plus',
    price: '$4.99/mo',
    current: false,
    features: ['$5,000 daily limit', '15% fee discount', '30-min rate lock', '1.5x reward points'],
    icon: Star,
    color: 'blue',
    recommended: true,
  },
  {
    id: 'PREMIUM',
    name: 'Premium',
    price: '$14.99/mo',
    current: false,
    features: ['$25,000 daily limit', '40% fee discount', '60-min rate lock', '2x reward points'],
    icon: Crown,
    color: 'purple',
  },
]

const tierColorMap: Record<string, { badge: string; border: string; iconBg: string; iconText: string }> = {
  gray: { badge: 'bg-gray-100 text-gray-700', border: 'border-gray-200', iconBg: 'bg-gray-100', iconText: 'text-gray-500' },
  blue: { badge: 'bg-blue-100 text-blue-700', border: 'border-blue-300', iconBg: 'bg-blue-100', iconText: 'text-blue-600' },
  purple: { badge: 'bg-purple-100 text-purple-700', border: 'border-purple-300', iconBg: 'bg-purple-100', iconText: 'text-purple-600' },
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'subscription'>('profile')

  const tabs = [
    { id: 'profile' as const, label: 'Personal Info', icon: User },
    { id: 'security' as const, label: 'Security', icon: Lock },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'subscription' as const, label: 'Subscription', icon: CreditCard },
  ]

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500">Manage your account preferences</p>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Profile tab */}
      {activeTab === 'profile' && (
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-semibold">
                JD
              </div>
              <div>
                <p className="font-semibold text-gray-900">John Doe</p>
                <p className="text-sm text-gray-500">john.doe@email.com</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="success">KYC Verified</Badge>
                  <Badge variant="outline">Free Plan</Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="First Name" defaultValue="John" />
              <Input label="Last Name" defaultValue="Doe" />
              <Input label="Email" type="email" defaultValue="john.doe@email.com" />
              <Input label="Phone" type="tel" defaultValue="+1 (555) 123-4567" />
              <Input label="Date of Birth" type="date" defaultValue="1990-05-15" />
              <Input label="Country" defaultValue="United States" disabled />
            </div>

            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Address</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Street Address" defaultValue="123 Main Street" className="sm:col-span-2" />
                <Input label="City" defaultValue="New York" />
                <Input label="State" defaultValue="NY" />
                <Input label="ZIP Code" defaultValue="10001" />
              </div>
            </div>

            <div className="flex justify-end">
              <Button>Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security tab */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your password regularly for security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input label="Current Password" type="password" placeholder="Enter current password" />
              <Input label="New Password" type="password" placeholder="Enter new password" />
              <Input label="Confirm New Password" type="password" placeholder="Confirm new password" />
              <div className="flex justify-end">
                <Button>Update Password</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>Add an extra layer of security to your account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">2FA is enabled</p>
                    <p className="text-xs text-gray-500">Using authenticator app</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Manage</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Login Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Chrome on macOS</p>
                    <p className="text-xs text-gray-500">New York, US -- Current session</p>
                  </div>
                  <Badge variant="success">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Safari on iPhone</p>
                    <p className="text-xs text-gray-500">New York, US -- Last active 2 hours ago</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-red-600">Revoke</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Notifications tab */}
      {activeTab === 'notifications' && (
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Choose how you want to be notified</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: 'Transfer updates', description: 'Get notified about transfer status changes', email: true, push: true },
                { label: 'Payment receipts', description: 'Receive payment confirmations', email: true, push: false },
                { label: 'Rate alerts', description: 'Notify when exchange rates reach your target', email: false, push: true },
                { label: 'Promotional offers', description: 'Special deals and discounts', email: true, push: false },
                { label: 'Security alerts', description: 'Login attempts and security events', email: true, push: true },
                { label: 'Referral updates', description: 'When friends sign up or complete transfers', email: true, push: true },
              ].map((pref, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{pref.label}</p>
                    <p className="text-xs text-gray-500">{pref.description}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked={pref.email}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-xs text-gray-500">Email</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked={pref.push}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-xs text-gray-500">Push</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-6">
              <Button>Save Preferences</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Subscription tab */}
      {activeTab === 'subscription' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Plan</CardTitle>
              <CardDescription>You are currently on the Free plan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {subscriptionTiers.map((tier) => {
                  const colors = tierColorMap[tier.color]
                  const Icon = tier.icon
                  return (
                    <div
                      key={tier.id}
                      className={`relative rounded-xl border-2 p-5 transition-shadow hover:shadow-md ${
                        tier.current ? 'border-blue-500 bg-blue-50/30' : colors.border
                      }`}
                    >
                      {tier.recommended && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <Badge className="bg-blue-600 text-white">Recommended</Badge>
                        </div>
                      )}
                      <div className={`w-10 h-10 rounded-lg ${colors.iconBg} flex items-center justify-center mb-3`}>
                        <Icon className={`w-5 h-5 ${colors.iconText}`} />
                      </div>
                      <p className="font-semibold text-gray-900">{tier.name}</p>
                      <p className="text-2xl font-bold text-gray-900 mb-4">{tier.price}</p>
                      <ul className="space-y-2 mb-5">
                        {tier.features.map((f, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                            <Check className="w-4 h-4 text-green-500 shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      {tier.current ? (
                        <Button variant="outline" className="w-full" disabled>
                          Current Plan
                        </Button>
                      ) : (
                        <Button className="w-full">
                          Upgrade
                        </Button>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
