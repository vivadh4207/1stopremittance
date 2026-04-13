import { RateCalculatorWidget } from './rate-calculator-widget'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 25px 25px, white 2%, transparent 0%)',
          backgroundSize: '50px 50px',
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Copy */}
          <div className="text-white space-y-6">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-4 py-1.5 text-sm text-blue-300">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Trusted by 500,000+ customers worldwide
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Send Money
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Worldwide
              </span>
              <span className="block text-3xl md:text-4xl lg:text-5xl mt-2 font-normal text-gray-300">
                at the Best Rates
              </span>
            </h1>
            <p className="text-lg text-gray-300 max-w-lg">
              Transfer money to 200+ countries with the lowest fees and best exchange rates.
              Fast, secure, and reliable.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-4">
              <div>
                <div className="text-2xl md:text-3xl font-bold text-white">200+</div>
                <div className="text-sm text-gray-400">Countries</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-white">$0.99</div>
                <div className="text-sm text-gray-400">From only</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-white">&lt;1hr</div>
                <div className="text-sm text-gray-400">Delivery</div>
              </div>
            </div>
          </div>

          {/* Right side - Calculator */}
          <div className="flex justify-center lg:justify-end">
            <RateCalculatorWidget />
          </div>
        </div>
      </div>
    </section>
  )
}
