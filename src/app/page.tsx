import { Navbar } from '@/components/landing/navbar'
import { HeroSection } from '@/components/landing/hero-section'
import { HowItWorks } from '@/components/landing/how-it-works'
import { TrustIndicators } from '@/components/landing/trust-indicators'
import { CorridorShowcase } from '@/components/landing/corridor-showcase'
import { FeeComparisonTable } from '@/components/landing/fee-comparison-table'
import { Testimonials } from '@/components/landing/testimonials'
import { Footer } from '@/components/landing/footer'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <CorridorShowcase />
        <HowItWorks />
        <TrustIndicators />
        <FeeComparisonTable />
        <Testimonials />

        {/* Final CTA */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Sending?
            </h2>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Join 500,000+ customers who trust 1StopRemittance for fast, affordable international transfers.
            </p>
            <Link href="/register">
              <Button size="xl" className="bg-white text-blue-700 hover:bg-gray-100 font-semibold shadow-lg">
                Create Free Account
              </Button>
            </Link>
            <p className="mt-4 text-sm text-blue-200">No hidden fees. Cancel anytime.</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
