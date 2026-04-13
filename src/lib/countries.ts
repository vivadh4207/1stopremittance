export interface CountryData {
  id: string
  name: string
  currency: string
  currencyName: string
  flagEmoji: string
  phoneCode: string
  canSendFrom: boolean
  canReceiveIn: boolean
}

export const COUNTRIES: CountryData[] = [
  { id: 'US', name: 'United States', currency: 'USD', currencyName: 'US Dollar', flagEmoji: '\u{1F1FA}\u{1F1F8}', phoneCode: '+1', canSendFrom: true, canReceiveIn: false },
  { id: 'GB', name: 'United Kingdom', currency: 'GBP', currencyName: 'British Pound', flagEmoji: '\u{1F1EC}\u{1F1E7}', phoneCode: '+44', canSendFrom: true, canReceiveIn: true },
  { id: 'CA', name: 'Canada', currency: 'CAD', currencyName: 'Canadian Dollar', flagEmoji: '\u{1F1E8}\u{1F1E6}', phoneCode: '+1', canSendFrom: true, canReceiveIn: true },
  { id: 'AU', name: 'Australia', currency: 'AUD', currencyName: 'Australian Dollar', flagEmoji: '\u{1F1E6}\u{1F1FA}', phoneCode: '+61', canSendFrom: true, canReceiveIn: true },
  { id: 'DE', name: 'Germany', currency: 'EUR', currencyName: 'Euro', flagEmoji: '\u{1F1E9}\u{1F1EA}', phoneCode: '+49', canSendFrom: true, canReceiveIn: true },
  { id: 'FR', name: 'France', currency: 'EUR', currencyName: 'Euro', flagEmoji: '\u{1F1EB}\u{1F1F7}', phoneCode: '+33', canSendFrom: true, canReceiveIn: true },
  { id: 'AE', name: 'United Arab Emirates', currency: 'AED', currencyName: 'UAE Dirham', flagEmoji: '\u{1F1E6}\u{1F1EA}', phoneCode: '+971', canSendFrom: true, canReceiveIn: true },
  { id: 'SA', name: 'Saudi Arabia', currency: 'SAR', currencyName: 'Saudi Riyal', flagEmoji: '\u{1F1F8}\u{1F1E6}', phoneCode: '+966', canSendFrom: true, canReceiveIn: true },
  { id: 'SG', name: 'Singapore', currency: 'SGD', currencyName: 'Singapore Dollar', flagEmoji: '\u{1F1F8}\u{1F1EC}', phoneCode: '+65', canSendFrom: true, canReceiveIn: true },
  { id: 'JP', name: 'Japan', currency: 'JPY', currencyName: 'Japanese Yen', flagEmoji: '\u{1F1EF}\u{1F1F5}', phoneCode: '+81', canSendFrom: true, canReceiveIn: true },
  { id: 'IN', name: 'India', currency: 'INR', currencyName: 'Indian Rupee', flagEmoji: '\u{1F1EE}\u{1F1F3}', phoneCode: '+91', canSendFrom: false, canReceiveIn: true },
  { id: 'NP', name: 'Nepal', currency: 'NPR', currencyName: 'Nepalese Rupee', flagEmoji: '\u{1F1F3}\u{1F1F5}', phoneCode: '+977', canSendFrom: false, canReceiveIn: true },
  { id: 'PK', name: 'Pakistan', currency: 'PKR', currencyName: 'Pakistani Rupee', flagEmoji: '\u{1F1F5}\u{1F1F0}', phoneCode: '+92', canSendFrom: false, canReceiveIn: true },
  { id: 'BD', name: 'Bangladesh', currency: 'BDT', currencyName: 'Bangladeshi Taka', flagEmoji: '\u{1F1E7}\u{1F1E9}', phoneCode: '+880', canSendFrom: false, canReceiveIn: true },
  { id: 'LK', name: 'Sri Lanka', currency: 'LKR', currencyName: 'Sri Lankan Rupee', flagEmoji: '\u{1F1F1}\u{1F1F0}', phoneCode: '+94', canSendFrom: false, canReceiveIn: true },
  { id: 'PH', name: 'Philippines', currency: 'PHP', currencyName: 'Philippine Peso', flagEmoji: '\u{1F1F5}\u{1F1ED}', phoneCode: '+63', canSendFrom: false, canReceiveIn: true },
  { id: 'MX', name: 'Mexico', currency: 'MXN', currencyName: 'Mexican Peso', flagEmoji: '\u{1F1F2}\u{1F1FD}', phoneCode: '+52', canSendFrom: false, canReceiveIn: true },
  { id: 'BR', name: 'Brazil', currency: 'BRL', currencyName: 'Brazilian Real', flagEmoji: '\u{1F1E7}\u{1F1F7}', phoneCode: '+55', canSendFrom: false, canReceiveIn: true },
  { id: 'NG', name: 'Nigeria', currency: 'NGN', currencyName: 'Nigerian Naira', flagEmoji: '\u{1F1F3}\u{1F1EC}', phoneCode: '+234', canSendFrom: false, canReceiveIn: true },
  { id: 'KE', name: 'Kenya', currency: 'KES', currencyName: 'Kenyan Shilling', flagEmoji: '\u{1F1F0}\u{1F1EA}', phoneCode: '+254', canSendFrom: false, canReceiveIn: true },
  { id: 'GH', name: 'Ghana', currency: 'GHS', currencyName: 'Ghanaian Cedi', flagEmoji: '\u{1F1EC}\u{1F1ED}', phoneCode: '+233', canSendFrom: false, canReceiveIn: true },
  { id: 'ZA', name: 'South Africa', currency: 'ZAR', currencyName: 'South African Rand', flagEmoji: '\u{1F1FF}\u{1F1E6}', phoneCode: '+27', canSendFrom: false, canReceiveIn: true },
  { id: 'EG', name: 'Egypt', currency: 'EGP', currencyName: 'Egyptian Pound', flagEmoji: '\u{1F1EA}\u{1F1EC}', phoneCode: '+20', canSendFrom: false, canReceiveIn: true },
  { id: 'VN', name: 'Vietnam', currency: 'VND', currencyName: 'Vietnamese Dong', flagEmoji: '\u{1F1FB}\u{1F1F3}', phoneCode: '+84', canSendFrom: false, canReceiveIn: true },
  { id: 'TH', name: 'Thailand', currency: 'THB', currencyName: 'Thai Baht', flagEmoji: '\u{1F1F9}\u{1F1ED}', phoneCode: '+66', canSendFrom: false, canReceiveIn: true },
  { id: 'MY', name: 'Malaysia', currency: 'MYR', currencyName: 'Malaysian Ringgit', flagEmoji: '\u{1F1F2}\u{1F1FE}', phoneCode: '+60', canSendFrom: false, canReceiveIn: true },
  { id: 'ID', name: 'Indonesia', currency: 'IDR', currencyName: 'Indonesian Rupiah', flagEmoji: '\u{1F1EE}\u{1F1E9}', phoneCode: '+62', canSendFrom: false, canReceiveIn: true },
  { id: 'TR', name: 'Turkey', currency: 'TRY', currencyName: 'Turkish Lira', flagEmoji: '\u{1F1F9}\u{1F1F7}', phoneCode: '+90', canSendFrom: false, canReceiveIn: true },
  { id: 'CN', name: 'China', currency: 'CNY', currencyName: 'Chinese Yuan', flagEmoji: '\u{1F1E8}\u{1F1F3}', phoneCode: '+86', canSendFrom: false, canReceiveIn: true },
  { id: 'KR', name: 'South Korea', currency: 'KRW', currencyName: 'South Korean Won', flagEmoji: '\u{1F1F0}\u{1F1F7}', phoneCode: '+82', canSendFrom: true, canReceiveIn: true },
]

export const SEND_COUNTRIES = COUNTRIES.filter(c => c.canSendFrom)
export const RECEIVE_COUNTRIES = COUNTRIES.filter(c => c.canReceiveIn)

export function getCountry(id: string) {
  return COUNTRIES.find(c => c.id === id)
}

export function getCountryByCurrency(currency: string) {
  return COUNTRIES.find(c => c.currency === currency)
}

export const POPULAR_CORRIDORS = [
  { from: 'USD', to: 'INR', label: 'USA to India' },
  { from: 'USD', to: 'NPR', label: 'USA to Nepal' },
  { from: 'USD', to: 'PHP', label: 'USA to Philippines' },
  { from: 'GBP', to: 'INR', label: 'UK to India' },
  { from: 'USD', to: 'MXN', label: 'USA to Mexico' },
  { from: 'AED', to: 'INR', label: 'UAE to India' },
  { from: 'USD', to: 'PKR', label: 'USA to Pakistan' },
  { from: 'USD', to: 'BDT', label: 'USA to Bangladesh' },
]
