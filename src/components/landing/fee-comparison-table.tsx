import { Check, X, Minus } from 'lucide-react'

const competitors = [
  {
    name: '1StopRemittance',
    highlight: true,
    fee: '$0.99 - $4.99',
    fxMarkup: '0.5% - 1.5%',
    speed: 'Minutes',
    countries: '200+',
    mobileWallet: true,
    cashPickup: true,
    loyalty: true,
  },
  {
    name: 'Western Union',
    highlight: false,
    fee: '$5 - $25',
    fxMarkup: '2% - 5%',
    speed: 'Minutes - Days',
    countries: '200+',
    mobileWallet: true,
    cashPickup: true,
    loyalty: false,
  },
  {
    name: 'Traditional Banks',
    highlight: false,
    fee: '$25 - $50',
    fxMarkup: '3% - 7%',
    speed: '2 - 5 Days',
    countries: 'Limited',
    mobileWallet: false,
    cashPickup: false,
    loyalty: false,
  },
  {
    name: 'Other Apps',
    highlight: false,
    fee: '$1.99 - $9.99',
    fxMarkup: '1% - 3%',
    speed: 'Hours - Days',
    countries: '50+',
    mobileWallet: true,
    cashPickup: false,
    loyalty: false,
  },
]

export function FeeComparisonTable() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Compare & Save
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            See how much you can save compared to traditional providers
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-4 px-4 text-left text-sm font-semibold text-gray-600">Feature</th>
                {competitors.map((c) => (
                  <th
                    key={c.name}
                    className={`py-4 px-4 text-center text-sm font-semibold ${
                      c.highlight ? 'text-blue-600 bg-blue-50 rounded-t-xl' : 'text-gray-600'
                    }`}
                  >
                    {c.name}
                    {c.highlight && (
                      <span className="block text-xs text-blue-500 font-normal mt-0.5">Best Choice</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Transfer Fee', key: 'fee' as const },
                { label: 'Exchange Rate Markup', key: 'fxMarkup' as const },
                { label: 'Delivery Speed', key: 'speed' as const },
                { label: 'Countries', key: 'countries' as const },
              ].map((row) => (
                <tr key={row.key} className="border-b border-gray-100">
                  <td className="py-4 px-4 text-sm text-gray-600 font-medium">{row.label}</td>
                  {competitors.map((c) => (
                    <td
                      key={c.name}
                      className={`py-4 px-4 text-center text-sm ${
                        c.highlight ? 'bg-blue-50 font-semibold text-gray-900' : 'text-gray-700'
                      }`}
                    >
                      {c[row.key]}
                    </td>
                  ))}
                </tr>
              ))}
              {[
                { label: 'Mobile Wallet', key: 'mobileWallet' as const },
                { label: 'Cash Pickup', key: 'cashPickup' as const },
                { label: 'Loyalty Rewards', key: 'loyalty' as const },
              ].map((row) => (
                <tr key={row.key} className="border-b border-gray-100">
                  <td className="py-4 px-4 text-sm text-gray-600 font-medium">{row.label}</td>
                  {competitors.map((c) => (
                    <td
                      key={c.name}
                      className={`py-4 px-4 text-center ${c.highlight ? 'bg-blue-50' : ''}`}
                    >
                      {c[row.key] ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-400 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
