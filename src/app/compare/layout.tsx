import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Compare Money Transfer Rates | 1StopRemittance',
  description:
    'Compare live exchange rates and fees from Wise, Remitly, Western Union, and 5+ more providers. Find the cheapest way to send money abroad from the US.',
  keywords:
    'compare money transfer rates, best exchange rates, cheapest remittance, Wise vs Remitly, send money comparison',
}

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
