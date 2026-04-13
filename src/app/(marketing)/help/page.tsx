import { Navbar } from '@/components/landing/navbar'
import { Footer } from '@/components/landing/footer'
import { Search, Send, CreditCard, Shield, Clock, Globe, HelpCircle, Mail, Phone, MessageCircle } from 'lucide-react'
import Link from 'next/link'

const categories = [
  {
    icon: Send,
    title: 'Sending Money',
    questions: [
      'How do I send money?',
      'What are the transfer limits?',
      'How long does a transfer take?',
      'Can I cancel a transfer?',
    ],
  },
  {
    icon: CreditCard,
    title: 'Payments & Fees',
    questions: [
      'What payment methods are accepted?',
      'How are fees calculated?',
      'What exchange rate do I get?',
      'Are there any hidden fees?',
    ],
  },
  {
    icon: Shield,
    title: 'Security & Verification',
    questions: [
      'How do I verify my identity?',
      'Is my information secure?',
      'What documents are required?',
      'Why was my transfer flagged?',
    ],
  },
  {
    icon: Globe,
    title: 'Delivery & Recipients',
    questions: [
      'What delivery methods are available?',
      'How do I add a recipient?',
      'What information do I need?',
      'Which countries can I send to?',
    ],
  },
]

export default function HelpPage() {
  return (
    <>
      <Navbar />
      <main className="py-20 bg-gray-50 min-h-screen">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">How Can We Help?</h1>
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for help..."
                className="w-full h-14 pl-12 pr-4 rounded-xl border border-gray-300 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {categories.map((cat) => (
              <div key={cat.title} className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <cat.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">{cat.title}</h2>
                </div>
                <ul className="space-y-3">
                  {cat.questions.map((q) => (
                    <li key={q}>
                      <button className="text-sm text-gray-600 hover:text-blue-600 transition-colors text-left flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 flex-shrink-0" />
                        {q}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Contact Us</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 rounded-xl bg-gray-50">
                <Mail className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                <p className="text-sm text-gray-600">support@1stopremittance.com</p>
                <p className="text-xs text-gray-500 mt-1">Response within 24 hours</p>
              </div>
              <div className="text-center p-6 rounded-xl bg-gray-50">
                <Phone className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                <p className="text-sm text-gray-600">1-800-REMIT-NOW</p>
                <p className="text-xs text-gray-500 mt-1">Mon-Fri 9am-9pm EST</p>
              </div>
              <div className="text-center p-6 rounded-xl bg-gray-50">
                <MessageCircle className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Live Chat</h3>
                <p className="text-sm text-gray-600">Chat with our team</p>
                <p className="text-xs text-gray-500 mt-1">Available 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
