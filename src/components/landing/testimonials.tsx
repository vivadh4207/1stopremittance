import { Star } from 'lucide-react'

const testimonials = [
  {
    name: 'Rajesh K.',
    location: 'New York, USA',
    corridor: 'USA to India',
    text: 'Best rates I have found for sending money to my family in India. The transfer was completed in under 30 minutes!',
    rating: 5,
  },
  {
    name: 'Maria S.',
    location: 'London, UK',
    corridor: 'UK to Philippines',
    text: 'I switched from my bank and saved over $30 on each transfer. The mobile wallet delivery is super convenient.',
    rating: 5,
  },
  {
    name: 'Ahmed H.',
    location: 'Dubai, UAE',
    corridor: 'UAE to Pakistan',
    text: 'Reliable service with excellent customer support. I use it every month to send money home.',
    rating: 5,
  },
  {
    name: 'Priya M.',
    location: 'Toronto, Canada',
    corridor: 'Canada to Nepal',
    text: 'The loyalty points program is great! I have earned enough points to cover fees on my last two transfers.',
    rating: 4,
  },
]

export function Testimonials() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Loved by Customers Worldwide
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Join 500,000+ happy customers sending money with 1StopRemittance
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    className={`w-4 h-4 ${j < t.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-700 mb-4 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
              <div className="border-t border-gray-100 pt-3">
                <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                <p className="text-xs text-gray-500">{t.location}</p>
                <p className="text-xs text-blue-600 mt-1">{t.corridor}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
