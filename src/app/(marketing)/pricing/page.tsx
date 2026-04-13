import { Navbar } from '@/components/landing/navbar'
import { Footer } from '@/components/landing/footer'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import Link from 'next/link'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'Perfect for occasional senders',
    features: [
      'Send to 200+ countries',
      'Bank deposit & cash pickup',
      'Standard exchange rates',
      'Up to $2,500/day',
      'Email support',
      'Basic tracking',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Plus',
    price: '$4.99',
    period: '/month',
    description: 'For regular senders who want savings',
    features: [
      'Everything in Free',
      '0.2% better exchange rates',
      '15% off transfer fees',
      'Up to $5,000/day',
      '30-min rate lock',
      '1.5x reward points',
      'Priority email support',
    ],
    cta: 'Start 30-Day Trial',
    popular: false,
  },
  {
    name: 'Premium',
    price: '$14.99',
    period: '/month',
    description: 'Best value for frequent senders',
    features: [
      'Everything in Plus',
      '0.5% better exchange rates',
      '40% off transfer fees',
      'Up to $25,000/day',
      '60-min rate lock',
      '2x reward points',
      'Priority phone support',
      'Basic API access',
    ],
    cta: 'Start 30-Day Trial',
    popular: true,
  },
  {
    name: 'Business',
    price: '$49.99',
    period: '/month',
    description: 'For businesses & high-volume senders',
    features: [
      'Everything in Premium',
      '0.8% better exchange rates',
      '60% off transfer fees',
      'Up to $100,000/day',
      '120-min rate lock',
      '3x reward points',
      'Dedicated account manager',
      'Full API access',
      'Bulk transfers',
      'Custom integrations',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
]

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the plan that fits your sending needs. Upgrade or downgrade anytime.
              All plans include free account creation and no hidden fees.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`bg-white rounded-2xl shadow-sm border-2 p-6 flex flex-col ${
                  plan.popular ? 'border-blue-500 relative' : 'border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500">{plan.period}</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/register">
                  <Button
                    className="w-full"
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          {/* FAQ section */}
          <div className="mt-20 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                { q: 'Can I switch plans at any time?', a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.' },
                { q: 'Is there a free trial?', a: 'Yes, Plus and Premium plans come with a 30-day free trial. No credit card required to start.' },
                { q: 'What payment methods do you accept?', a: 'We accept debit cards, credit cards, bank transfers (ACH), Apple Pay, and Google Pay.' },
                { q: 'Are there any hidden fees?', a: 'No. We show you the exact fee and exchange rate before every transfer. What you see is what you pay.' },
                { q: 'How fast are transfers delivered?', a: 'Most bank deposits arrive within minutes. Cash pickup and mobile wallet transfers are typically instant.' },
              ].map((faq) => (
                <div key={faq.q} className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="font-semibold text-gray-900">{faq.q}</h3>
                  <p className="mt-2 text-sm text-gray-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
