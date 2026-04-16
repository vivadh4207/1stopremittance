/**
 * FAQ content — single source of truth for the /faqs page and FAQPage schema.
 * Grouped by topic for both rendering and JSON-LD structured data.
 */

export interface FAQ {
  q: string
  a: string
}

export interface FAQSection {
  id: string
  title: string
  faqs: FAQ[]
}

export const FAQ_SECTIONS: FAQSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    faqs: [
      {
        q: 'What is 1StopRemittance?',
        a: '1StopRemittance is a comparison platform that shows live exchange rates and fees from 8+ money transfer providers side-by-side, so you can find the cheapest way to send money home. We do not handle your funds — you transact directly with the provider of your choice.',
      },
      {
        q: 'Is 1StopRemittance free to use?',
        a: 'Yes. Comparing rates and using our corridor guides is 100% free. We earn a small referral fee from providers when you click through, which lets us keep the platform free for diaspora users.',
      },
      {
        q: 'Which countries do you cover?',
        a: 'We currently compare remittance corridors to Nigeria, Philippines, India, Ghana, Mexico, Kenya, Pakistan, and Bangladesh, with more corridors being added based on user demand.',
      },
    ],
  },
  {
    id: 'rates-fees',
    title: 'Rates and Fees',
    faqs: [
      {
        q: 'Are your exchange rates live?',
        a: 'Yes. We fetch live mid-market rates from the European Central Bank via the Frankfurter API every two hours, then apply each provider\'s published margin and fee schedule to estimate the amount your recipient will receive.',
      },
      {
        q: 'Why is the provider rate different from the mid-market rate?',
        a: 'The mid-market rate is the interbank wholesale rate — the rate at which banks trade with each other. Every retail provider applies a margin on top (typically 0.5%–3%) plus a fixed fee. Our comparison surfaces both so you can see the true cost.',
      },
      {
        q: 'What does "zero fee" actually mean?',
        a: 'Some providers advertise "no fees" but bake their margin into a worse exchange rate. Always compare the total amount received, not just the fee line item. Our tool does this automatically.',
      },
      {
        q: 'How often are rates updated?',
        a: 'Rates are refreshed automatically every two hours via server-side ISR caching. Each comparison page shows the last updated timestamp.',
      },
    ],
  },
  {
    id: 'security-trust',
    title: 'Security and Trust',
    faqs: [
      {
        q: 'Do you store my financial information?',
        a: 'No. We never ask for bank details, card numbers, or account credentials. 1StopRemittance is a comparison site only — you complete your transfer directly with the provider you choose.',
      },
      {
        q: 'Are the providers you compare regulated?',
        a: 'Yes. We only list providers regulated by authorities such as FinCEN (US), the FCA (UK), FINTRAC (Canada), and similar bodies in their operating regions. Check each provider\'s page for their specific licensing.',
      },
      {
        q: 'How do you make money?',
        a: 'When you click through to a provider and complete a transfer, the provider pays us a small referral commission. This never affects the rate or fee you see — you pay the same as going direct.',
      },
    ],
  },
  {
    id: 'sending-money',
    title: 'Sending Money',
    faqs: [
      {
        q: 'How long does a transfer take?',
        a: 'Delivery times vary by provider and destination. Mobile wallet top-ups (e.g., bKash, M-Pesa) are often instant. Bank deposits typically take a few hours to two business days. Cash pickup is usually available within minutes at major agents.',
      },
      {
        q: 'What\'s the minimum and maximum I can send?',
        a: 'Limits depend on the provider and destination. Most providers allow transfers from $1 up to $50,000 per transaction for verified users, with daily and annual cumulative limits.',
      },
      {
        q: 'Can I send to a mobile wallet?',
        a: 'Yes, for supported corridors. Popular mobile wallets we support include bKash and Nagad (Bangladesh), M-Pesa (Kenya), GCash and PayMaya (Philippines), and Paystack and Opay (Nigeria).',
      },
    ],
  },
  {
    id: 'account-support',
    title: 'Account and Support',
    faqs: [
      {
        q: 'Do I need to create an account?',
        a: 'No account is required to compare rates or view corridor guides. You may subscribe to rate alerts with just an email address if you want notifications when rates move in your favor.',
      },
      {
        q: 'How do I contact support?',
        a: 'Use the chat widget in the bottom-right of any page or email us at support@1stopremittance.com. We respond within one business day.',
      },
      {
        q: 'Can I suggest a corridor or provider?',
        a: 'Absolutely — we prioritize additions based on user requests. Send us a note via the chat widget and we will review it.',
      },
    ],
  },
]

export function getAllFaqs(): FAQ[] {
  return FAQ_SECTIONS.flatMap((s) => s.faqs)
}

/**
 * Build schema.org FAQPage JSON-LD for SEO.
 * Google uses this to render rich FAQ snippets in search results.
 */
export function buildFaqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: getAllFaqs().map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  }
}
