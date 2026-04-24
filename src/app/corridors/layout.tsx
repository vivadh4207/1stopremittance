import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Money Transfer Corridors | 1StopRemittance',
  description:
    'Browse all supported money transfer corridors. Compare rates for sending money from the US to Nigeria, Philippines, India, Ghana, Mexico, Kenya, and more.',
  keywords:
    'remittance corridors, USD to NGN, USD to PHP, money transfer routes, send money to Nigeria, send money to Philippines',
}

export default function CorridorsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
