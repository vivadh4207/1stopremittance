import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us | 1StopRemittance',
  description:
    'Learn about 1StopRemittance — a free comparison platform helping the diaspora community find the best rates and lowest fees for sending money home.',
  keywords:
    'about 1StopRemittance, remittance comparison, diaspora money transfer, who we are',
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
