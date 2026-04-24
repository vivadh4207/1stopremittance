import type { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: 'Privacy Policy | 1StopRemittance',
  description: 'Learn how 1StopRemittance collects, uses, and protects your personal information.',
  robots: { index: true, follow: true },
}

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="bg-gray-950 text-white min-h-screen pt-24 pb-20">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold mb-4">Privacy Policy</h1>
          <p className="text-gray-400 mb-10 text-sm">
            Last updated: April 2026
          </p>

          {[
            {
              title: '1. Introduction',
              content: `1StopRemittance ("we," "us," or "our") is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website. We are not a law firm. Please read this policy carefully.`,
            },
            {
              title: '2. Information We Collect',
              content: `We collect information you provide directly (name, email, state when submitting service inquiries), usage data (pages visited, time on site, referral source via analytics cookies if consented), and technical data (IP address, browser type, device type for security and fraud prevention).

We do NOT collect: Social Security Numbers, credit card numbers, bank account details, or government ID numbers through our website forms.`,
            },
            {
              title: '3. Cookie Policy',
              content: `We use the following categories of cookies:
• Strictly Necessary: Required for the website to function (session management, CSRF protection)
• Preferences: Remember your settings (currency selection, language)
• Analytics: Google Analytics to understand how visitors use the site (only if you consent)
• Marketing: Conversion tracking for advertising (only if you consent)

You can change your cookie preferences at any time using the cookie settings widget in the footer.`,
            },
            {
              title: '4. How We Use Your Information',
              content: `We use your information to: respond to service inquiries, process and fulfill document preparation requests, send transaction confirmation emails, improve our website and services, comply with legal obligations, and prevent fraud.

We do NOT sell your personal data to third parties.`,
            },
            {
              title: '5. Data Retention',
              content: `Service inquiry data is retained for 24 months. Analytics data is retained for 26 months (Google Analytics standard). You may request deletion of your data at any time by emailing privacy@1stopremittance.com.`,
            },
            {
              title: '6. Your Rights (GDPR / CCPA)',
              content: `You have the right to: access the data we hold about you, correct inaccurate data, request deletion of your data, opt out of marketing communications, opt out of data sale (we don't sell data), and lodge a complaint with a supervisory authority.

California residents have additional rights under CCPA. To exercise your rights, contact privacy@1stopremittance.com.`,
            },
            {
              title: '7. Security',
              content: `We implement industry-standard security measures including 256-bit SSL/TLS encryption, secure password hashing, and regular security audits. However, no method of transmission over the Internet is 100% secure.`,
            },
            {
              title: '8. Legal Disclaimer',
              content: `1StopRemittance is NOT a law firm and does NOT provide legal advice. We provide document preparation and business filing services using publicly available government forms and information. For legal advice, please consult a licensed attorney in your jurisdiction.`,
            },
            {
              title: '9. Contact',
              content: `For privacy questions or to exercise your rights:
Email: privacy@1stopremittance.com
Address: 1StopRemittance, United States`,
            },
          ].map((section) => (
            <section key={section.title} className="mb-10">
              <h2 className="text-xl font-bold text-white mb-3">{section.title}</h2>
              <p className="text-gray-400 leading-relaxed whitespace-pre-line text-sm">
                {section.content}
              </p>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}
