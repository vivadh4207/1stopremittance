import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { CookieConsent } from '@/components/cookie-consent'
import { NavBot } from '@/components/nav-bot'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://1stopremittance.com'),
  title: {
    default: '1StopRemittance – Compare Rates & Start Your Business | Remittance + Legal Services',
    template: '%s | 1StopRemittance',
  },
  description:
    'Compare money transfer rates from Wise, Remitly, Western Union & more. Plus: form an LLC, get an EIN, register a trademark. All-in-one platform for diaspora entrepreneurs.',
  keywords: [
    // Remittance keywords
    'send money to nigeria',
    'send money to philippines',
    'compare remittance rates',
    'cheapest money transfer',
    'international wire transfer comparison',
    'best exchange rate today',
    'dollar to naira',
    'dollar to peso',
    'wise vs remitly',
    'western union alternative',
    'nigerian diaspora',
    'filipino balikbayan',
    'send money to india',
    'remittance fees comparison',
    'live exchange rates',
    // Legal services keywords
    'form LLC online',
    'cheap LLC formation',
    'EIN application online',
    'business formation service',
    'LegalZoom alternative',
    'ZenBusiness alternative',
    'trademark registration online',
    'registered agent service',
    'ITIN application',
    'immigrant entrepreneur',
    'diaspora business',
    'start business USA',
    'how to start LLC',
    'federal tax ID number',
  ].join(', '),
  authors: [{ name: '1StopRemittance' }],
  creator: '1StopRemittance',
  publisher: '1StopRemittance',
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://1stopremittance.com',
    siteName: '1StopRemittance',
    title: '1StopRemittance – Compare Rates & Start Your Business',
    description:
      'Compare money transfer rates from 8+ providers AND get business formation services — LLC, EIN, trademark and more. Built for diaspora entrepreneurs.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '1StopRemittance – Compare & Start',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '1StopRemittance – Compare Rates & Start Your Business',
    description: 'Compare remittance rates from 8+ providers. Form an LLC. Get an EIN. One platform.',
    images: ['/og-image.png'],
    creator: '@1StopRemittance',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-token-here',
    // bing: 'bing-verification-token',
  },
  alternates: {
    canonical: 'https://1stopremittance.com',
  },
}

// Structured Data (JSON-LD) for SEO
function JsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '1StopRemittance',
    url: 'https://1stopremittance.com',
    description: 'Compare money transfer rates and get business formation services for diaspora entrepreneurs.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://1stopremittance.com/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
    sameAs: [
      'https://twitter.com/1StopRemittance',
      'https://linkedin.com/company/1stopremittance',
    ],
  }

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: '1StopRemittance',
    url: 'https://1stopremittance.com',
    logo: 'https://1stopremittance.com/logo.png',
    description: 'Remittance comparison and business formation services for diaspora communities.',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'support@1stopremittance.com',
    },
    areaServed: 'US',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
    </>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.className} h-full antialiased`}>
      <head>
        <JsonLd />
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Security headers via meta (additional layer) */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
      </head>
      <body className="min-h-full flex flex-col bg-gray-950 text-white">
        {children}
        {/* Global components */}
        <CookieConsent />
        <NavBot />
      </body>
    </html>
  )
}
