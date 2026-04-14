import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, Clock, Shield, AlertTriangle } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { LEGAL_PRODUCTS, LEGAL_DISCLAIMER } from '@/lib/legal-services'
import { LegalServiceForm } from '@/components/legal-service-form'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return LEGAL_PRODUCTS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = LEGAL_PRODUCTS.find((p) => p.slug === slug)
  if (!product) return { title: 'Not Found' }

  return {
    title: `${product.name} | 1StopRemittance Business Services`,
    description: `${product.description} Starting at $${product.price}. ${product.processingTime} processing.`,
    keywords: [
      product.name.toLowerCase(),
      `how to get ${product.name.toLowerCase()}`,
      `${product.name.toLowerCase()} service`,
      `affordable ${product.name.toLowerCase()}`,
      `online ${product.name.toLowerCase()}`,
    ].join(', '),
  }
}

export default async function LegalServiceDetailPage({ params }: Props) {
  const { slug } = await params
  const product = LEGAL_PRODUCTS.find((p) => p.slug === slug)
  if (!product) notFound()

  return (
    <>
      <Navbar />
      <main className="bg-gray-950 text-white min-h-screen pt-24 pb-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Breadcrumb */}
          <Link
            href="/legal-services"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to All Services
          </Link>

          <div className="grid gap-12 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="flex items-start gap-4 mb-6">
                <div className="text-5xl">{product.icon}</div>
                <div>
                  <h1 className="text-3xl font-extrabold text-white">{product.name}</h1>
                  <p className="mt-2 text-gray-400">{product.description}</p>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="flex items-start gap-3 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 mb-8">
                <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5 shrink-0" />
                <p className="text-xs text-yellow-300">{LEGAL_DISCLAIMER}</p>
              </div>

              {/* Long Description */}
              <div className="prose prose-invert max-w-none">
                <h2 className="text-xl font-bold text-white mb-3">About This Service</h2>
                <p className="text-gray-300 leading-relaxed">{product.longDescription}</p>
              </div>

              {/* What's Included */}
              <div className="mt-8">
                <h2 className="text-xl font-bold text-white mb-4">What&apos;s Included</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {product.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQs */}
              <div className="mt-12">
                <h2 className="text-xl font-bold text-white mb-6">Frequently Asked Questions</h2>
                <div className="space-y-6">
                  {product.faqs.map((faq, i) => (
                    <div key={i} className="rounded-xl border border-white/10 bg-gray-900/50 p-6">
                      <h3 className="font-semibold text-white mb-2">{faq.question}</h3>
                      <p className="text-sm text-gray-400 leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar: Order Form */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="rounded-2xl border border-white/10 bg-gray-900/70 backdrop-blur-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-white">Get Started</h2>
                    <div className="flex items-center gap-1 text-emerald-400">
                      <Clock className="h-4 w-4" />
                      <span className="text-xs">{product.processingTime}</span>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="mb-6 p-4 rounded-xl bg-gray-800/60 border border-white/5">
                    <p className="text-sm text-gray-400 mb-1">Service Fee</p>
                    <p className="text-3xl font-extrabold text-white">
                      ${product.price}
                      <span className="text-base font-normal text-gray-400 ml-1">one-time</span>
                    </p>
                    {product.stateFee && (
                      <p className="text-xs text-gray-500 mt-1">+ {product.stateFee}</p>
                    )}
                  </div>

                  {/* Trust signals */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Shield className="h-3.5 w-3.5 text-emerald-400" />
                      Secure 256-bit SSL encryption
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                      Official government forms only
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                      Money-back guarantee if filing fails
                    </div>
                  </div>

                  {/* Interactive Form */}
                  <LegalServiceForm productId={product.id} productName={product.name} price={product.price} />

                  <p className="mt-4 text-center text-xs text-gray-500">
                    By submitting you agree to our{' '}
                    <Link href="/about" className="underline">Terms of Service</Link>.
                    We are not a law firm.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
