import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Remittance Guides & Resources | 1StopRemittance',
  description:
    'Expert guides for sending money abroad. Learn how to find the best rates, avoid hidden fees, and save on every transfer to Nigeria, Philippines, and more.',
  keywords:
    'remittance guide, money transfer tips, send money Nigeria guide, Philippines remittance tips, avoid hidden fees, exchange rate tips',
}

export default function GuidesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
