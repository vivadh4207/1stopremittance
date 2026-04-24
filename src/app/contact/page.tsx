import type { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ContactForm } from '@/components/contact-form'
import { Mail, MessageCircle, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact Us | Get Help with Remittance Questions',
  description:
    'Reach the 1StopRemittance team. We respond to every message within one business day — whether it is a rate question, a suggestion, or a bug report.',
  alternates: { canonical: 'https://1stopremittance.com/contact' },
}

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-950 pt-28 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block mb-4 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-medium text-emerald-400">
              We&apos;re Listening
            </span>
            <h1 className="text-4xl font-bold text-white sm:text-5xl mb-4">
              Contact{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Our Team
              </span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Questions about a corridor, a provider, or a feature request? Tell us below — we respond to every message within one business day.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.5fr,1fr]">
            <ContactForm />
            <aside className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-gray-900/60 p-6">
                <Mail className="h-6 w-6 text-emerald-400 mb-3" />
                <h3 className="text-white font-semibold mb-1">Email</h3>
                <a
                  href="mailto:support@1stopremittance.com"
                  className="text-sm text-emerald-400 hover:text-emerald-300"
                >
                  support@1stopremittance.com
                </a>
              </div>
              <div className="rounded-2xl border border-white/10 bg-gray-900/60 p-6">
                <MessageCircle className="h-6 w-6 text-emerald-400 mb-3" />
                <h3 className="text-white font-semibold mb-1">Live chat</h3>
                <p className="text-sm text-gray-400">
                  Click the chat widget in the bottom-right of any page.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-gray-900/60 p-6">
                <Clock className="h-6 w-6 text-emerald-400 mb-3" />
                <h3 className="text-white font-semibold mb-1">Response time</h3>
                <p className="text-sm text-gray-400">
                  One business day, usually much faster.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
