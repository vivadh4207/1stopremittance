import Link from 'next/link'
import { Globe, Mail, Phone } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-slate-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Globe className="h-6 w-6 text-blue-400" />
              <span className="text-xl font-bold text-white">1StopRemittance</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Send money worldwide with the best rates and lowest fees. Fast, secure, and reliable.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>support@1stopremittance.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>1-800-REMIT-NOW</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Send Money</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/register" className="hover:text-white transition-colors">Send to India</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">Send to Nepal</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">Send to Philippines</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">Send to Mexico</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">Send to Pakistan</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">All Countries</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="/legal/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/legal/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">For Business</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/register" className="hover:text-white transition-colors">Business API</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Business Pricing</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">Bulk Transfers</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">Partner Program</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; 2024 1StopRemittance. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Licensed money transfer service. Regulated financial institution.</p>
        </div>
      </div>
    </footer>
  )
}
