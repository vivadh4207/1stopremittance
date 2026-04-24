/**
 * i18n Configuration
 *
 * Supported locales, country→locale mapping for IP-based detection,
 * and human-readable locale names for the language switcher.
 */

export const locales = ['en', 'yo', 'ig', 'pcm', 'fil', 'es', 'fr', 'hi', 'sw'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'

/** Map Vercel's x-vercel-ip-country header to a default locale */
export const countryToLocale: Record<string, Locale> = {
  // Nigeria defaults to English (user can switch to yo/ig/pcm)
  NG: 'en',
  PH: 'fil',
  MX: 'es',
  AR: 'es',
  CO: 'es',
  PE: 'es',
  CL: 'es',
  ES: 'es',
  // French-speaking West Africa
  SN: 'fr',
  CI: 'fr',
  CM: 'fr',
  ML: 'fr',
  BF: 'fr',
  CD: 'fr',
  FR: 'fr',
  BE: 'fr',
  // Hindi
  IN: 'hi',
  // Swahili
  KE: 'sw',
  TZ: 'sw',
}

/** Display names in native script for the language switcher */
export const localeNames: Record<Locale, string> = {
  en: 'English',
  yo: 'Yorùbá',
  ig: 'Igbo',
  pcm: 'Pidgin',
  fil: 'Filipino',
  es: 'Español',
  fr: 'Français',
  hi: 'हिन्दी',
  sw: 'Kiswahili',
}

/** Flag emoji for each locale (for the switcher UI) */
export const localeFlags: Record<Locale, string> = {
  en: '🇺🇸',
  yo: '🇳🇬',
  ig: '🇳🇬',
  pcm: '🇳🇬',
  fil: '🇵🇭',
  es: '🇲🇽',
  fr: '🇫🇷',
  hi: '🇮🇳',
  sw: '🇰🇪',
}
