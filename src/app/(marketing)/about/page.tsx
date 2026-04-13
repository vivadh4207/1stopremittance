import { Navbar } from '@/components/landing/navbar'
import { Footer } from '@/components/landing/footer'
import { Globe, Users, Shield, Award, TrendingUp, Heart } from 'lucide-react'

const stats = [
  { label: 'Countries Served', value: '200+' },
  { label: 'Happy Customers', value: '500K+' },
  { label: 'Transfers Completed', value: '2M+' },
  { label: 'Money Transferred', value: '$5B+' },
]

const values = [
  { icon: Heart, title: 'Customer First', description: 'Every decision we make starts with how it impacts our customers. We build for you.' },
  { icon: Shield, title: 'Trust & Security', description: 'Bank-grade encryption and full regulatory compliance protect every transaction.' },
  { icon: TrendingUp, title: 'Fairness', description: 'We believe in transparent, fair pricing. No hidden fees, no surprises.' },
  { icon: Globe, title: 'Global Access', description: 'Everyone deserves affordable, fast access to send money to their loved ones.' },
]

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="py-20 bg-gradient-to-br from-slate-900 to-blue-900 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Making Global Money Transfers Simple
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              We started 1StopRemittance because we believed sending money to loved ones abroad
              should be fast, affordable, and stress-free. Today, we serve over 500,000 customers worldwide.
            </p>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-blue-600">{stat.value}</div>
                  <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Values</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value) => (
                <div key={value.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <value.icon className="w-10 h-10 text-blue-600 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-sm text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Our Story</h2>
            <div className="prose prose-lg text-gray-600 space-y-4">
              <p>
                Founded by immigrants who experienced firsthand the frustration of sending money home,
                1StopRemittance was built to solve a simple problem: why does it cost so much to send
                money to your family?
              </p>
              <p>
                Traditional banks and legacy providers charge exorbitant fees and hide the true cost
                in unfavorable exchange rates. We built a platform that combines technology with
                transparency to deliver the best possible value to our customers.
              </p>
              <p>
                Today, we process millions of transfers annually, connecting families and businesses
                across 200+ countries. Our mission remains the same: make international money transfers
                fast, affordable, and accessible to everyone.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
