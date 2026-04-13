export const APP_NAME = '1StopRemittance'
export const APP_DESCRIPTION = 'Compare money transfer rates. Send smarter to Nigeria & Philippines.'

export const PROVIDERS = [
  { id: 'wise', name: 'Wise', logo: '🦉', rating: 4.8, reviews: '142K', speed: '1-2 hrs', color: '#9FE870', url: 'https://wise.com' },
  { id: 'remitly', name: 'Remitly', logo: '💸', rating: 4.6, reviews: '89K', speed: 'Minutes', color: '#1B75BC', url: 'https://remitly.com' },
  { id: 'westernunion', name: 'Western Union', logo: '🟡', rating: 4.1, reviews: '67K', speed: 'Minutes', color: '#FFDD00', url: 'https://westernunion.com' },
  { id: 'xoom', name: 'Xoom (PayPal)', logo: '🅿️', rating: 4.3, reviews: '34K', speed: '1-3 days', color: '#0070BA', url: 'https://xoom.com' },
  { id: 'worldremit', name: 'WorldRemit', logo: '🌍', rating: 4.5, reviews: '52K', speed: 'Minutes', color: '#7B2D8E', url: 'https://worldremit.com' },
  { id: 'ofx', name: 'OFX', logo: '💱', rating: 4.4, reviews: '28K', speed: '1-2 days', color: '#00264D', url: 'https://ofx.com' },
  { id: 'moneygram', name: 'MoneyGram', logo: '🔵', rating: 4.0, reviews: '45K', speed: 'Minutes', color: '#FF6600', url: 'https://moneygram.com' },
  { id: 'sendwave', name: 'Sendwave', logo: '⚡', rating: 4.5, reviews: '19K', speed: '1 day', color: '#6C5CE7', url: 'https://sendwave.com' },
] as const

export const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸', symbol: '$' },
  { code: 'NGN', name: 'Nigerian Naira', flag: '🇳🇬', symbol: '₦' },
  { code: 'PHP', name: 'Philippine Peso', flag: '🇵🇭', symbol: '₱' },
  { code: 'INR', name: 'Indian Rupee', flag: '🇮🇳', symbol: '₹' },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧', symbol: '£' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺', symbol: '€' },
  { code: 'MXN', name: 'Mexican Peso', flag: '🇲🇽', symbol: '$' },
  { code: 'PKR', name: 'Pakistani Rupee', flag: '🇵🇰', symbol: '₨' },
  { code: 'GHS', name: 'Ghanaian Cedi', flag: '🇬🇭', symbol: '₵' },
  { code: 'KES', name: 'Kenyan Shilling', flag: '🇰🇪', symbol: 'KSh' },
  { code: 'BDT', name: 'Bangladeshi Taka', flag: '🇧🇩', symbol: '৳' },
  { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦', symbol: 'C$' },
] as const

export const BASE_RATES: Record<string, number> = {
  USD: 1, NGN: 1550, PHP: 56.2, INR: 83.5, GBP: 0.79, EUR: 0.92,
  MXN: 17.1, PKR: 278, GHS: 14.8, KES: 153, BDT: 110, CAD: 1.36,
}

export const FEATURED_CORRIDORS = [
  { from: 'USD', to: 'NGN', label: 'USA to Nigeria', flag: '🇳🇬', slug: 'usd-to-ngn' },
  { from: 'USD', to: 'PHP', label: 'USA to Philippines', flag: '🇵🇭', slug: 'usd-to-php' },
  { from: 'USD', to: 'INR', label: 'USA to India', flag: '🇮🇳', slug: 'usd-to-inr' },
  { from: 'USD', to: 'GHS', label: 'USA to Ghana', flag: '🇬🇭', slug: 'usd-to-ghs' },
  { from: 'USD', to: 'MXN', label: 'USA to Mexico', flag: '🇲🇽', slug: 'usd-to-mxn' },
  { from: 'USD', to: 'KES', label: 'USA to Kenya', flag: '🇰🇪', slug: 'usd-to-kes' },
] as const

export function getRate(from: string, to: string): number {
  return (BASE_RATES[to] || 1) / (BASE_RATES[from] || 1)
}

export function generateProviderRates(amount: number, from: string, to: string) {
  const baseRate = getRate(from, to)
  return PROVIDERS.map((p) => {
    const margin = 0.97 + Math.random() * 0.04
    const rate = baseRate * margin
    const fee = +(1.5 + Math.random() * 6).toFixed(2)
    const received = +((amount - fee) * rate).toFixed(2)
    return { ...p, rate: +rate.toFixed(4), fee, received, total: +amount.toFixed(2) }
  }).sort((a, b) => b.received - a.received)
}
