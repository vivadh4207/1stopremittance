import { Shield, Lock, Globe, Award, Users, Headphones } from 'lucide-react'

const indicators = [
  { icon: Shield, title: 'Licensed & Regulated', description: 'Fully compliant with financial regulations across all operating jurisdictions' },
  { icon: Lock, title: '256-bit Encryption', description: 'Bank-grade security protects every transaction and personal data' },
  { icon: Globe, title: '200+ Countries', description: 'Send to virtually any country with competitive rates on every corridor' },
  { icon: Award, title: 'Best Rate Guarantee', description: 'We match or beat competitor rates on all major corridors' },
  { icon: Users, title: '500K+ Customers', description: 'Trusted by half a million customers worldwide since launch' },
  { icon: Headphones, title: '24/7 Support', description: 'Round-the-clock customer support via chat, email, and phone' },
]

export function TrustIndicators() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Why Choose 1StopRemittance
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            We combine the best rates, lowest fees, and fastest delivery with world-class security.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {indicators.map((item, index) => (
            <div key={index} className="flex gap-4 p-6 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
