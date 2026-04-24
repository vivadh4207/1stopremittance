'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Clock, ArrowRight, ChevronRight, Mail } from 'lucide-react'

interface GuideContent {
  title: string
  flag: string
  category: string
  readTime: string
  sections: { heading: string; content: string }[]
  relatedSlugs: string[]
}

const GUIDE_CONTENT: Record<string, GuideContent> = {
  'best-ways-send-money-nigeria': {
    title: 'Best Ways to Send Money to Nigeria in 2026',
    flag: '🇳🇬',
    category: 'Nigeria',
    readTime: '8 min',
    sections: [
      {
        heading: 'Why Comparing Providers Matters for Nigeria',
        content: 'Nigeria is Africa\'s largest remittance market, receiving over $20 billion annually from its diaspora. The exchange rate between USD and NGN fluctuates significantly, and different providers apply different markups on top of the mid-market rate. This means that on a $1,000 transfer, you could see a difference of 50,000 to 100,000 Naira depending on which service you choose. The days of defaulting to Western Union are over — modern providers like Wise, Remitly, and Sendwave offer dramatically better rates and lower fees.',
      },
      {
        heading: 'Top Providers for USD to NGN Transfers',
        content: 'Wise (formerly TransferWise) consistently offers rates closest to the mid-market rate with transparent fees starting at $1.50. Remitly is excellent for speed, offering instant delivery to most Nigerian banks and competitive rates. Sendwave specializes in African corridors and charges zero fees on transfers (they make money on the exchange rate margin, which is still competitive). Western Union and MoneyGram are best for cash pickup if your recipient doesn\'t have a bank account — they have thousands of agent locations across Nigeria. WorldRemit offers a good balance of speed, rates, and delivery options including airtime top-up.',
      },
      {
        heading: 'Understanding the Nigerian Naira Exchange Rate',
        content: 'Nigeria has experienced significant exchange rate volatility in recent years. The Central Bank of Nigeria (CBN) has moved toward a more market-driven exchange rate, which means the official rate and parallel market rate are converging. When comparing providers, look at the actual amount your recipient will receive in Naira, not just the exchange rate — some providers advertise a good rate but charge high fees that eat into the savings. Always check the total cost (send amount + fees) versus the total received.',
      },
      {
        heading: 'Best Delivery Methods in Nigeria',
        content: 'Bank transfer is the most popular and cheapest option. Major Nigerian banks like GTBank, Zenith, Access Bank, First Bank, and UBA all receive international transfers well. Mobile money is growing rapidly — providers like Sendwave support direct delivery to mobile wallets. Cash pickup remains important for recipients in rural areas or without bank accounts. Some providers also offer airtime top-up, which is a quick way to support family members with phone credit. For the best rates, always choose bank transfer when possible.',
      },
    ],
    relatedSlugs: ['nigerian-diaspora-remittance-guide', 'avoid-hidden-fees-money-transfers'],
  },
  'cheapest-way-send-money-philippines': {
    title: 'Cheapest Way to Send Money to the Philippines',
    flag: '🇵🇭',
    category: 'Philippines',
    readTime: '6 min',
    sections: [
      {
        heading: 'The Filipino Remittance Landscape',
        content: 'The Philippines receives over $36 billion in remittances annually, with a significant portion coming from the United States. For Filipino Americans (often called Balikbayan), sending money home is a regular part of life — supporting families, paying for education, healthcare, and contributing to household expenses. With so much money flowing, even small savings on fees and exchange rates add up to thousands of pesos over a year.',
      },
      {
        heading: 'Comparing Fees and Rates for PHP Transfers',
        content: 'Wise offers the most transparent pricing with fees starting around $1.50 for bank transfers and rates very close to the mid-market rate. Remitly frequently runs promotions for Filipino corridors, including zero-fee first transfers and enhanced exchange rates. Xoom (owned by PayPal) is popular for its reliable delivery to Philippine banks and GCash. Western Union has the widest cash pickup network in the Philippines through Cebuana Lhuillier, LBC, and M Lhuillier locations. For GCash delivery, Remitly and WorldRemit offer instant transfers.',
      },
      {
        heading: 'GCash vs Bank Deposit: Which Is Better?',
        content: 'GCash has become the go-to digital wallet in the Philippines with over 80 million users. For recipients, GCash delivery is instant and convenient — they can use the funds immediately for bills payment, shopping, or cash out at any GCash partner. Bank deposits take 1-2 business days but may be better for larger amounts. Some providers offer slightly better rates for GCash delivery. Maya (formerly PayMaya) is another popular option. If your recipient regularly uses GCash, it\'s usually the fastest and most convenient choice.',
      },
      {
        heading: 'Money-Saving Tips for Filipino Americans',
        content: 'First, always pay via bank transfer (ACH) from your US bank account — this avoids the 2-4% credit card surcharge. Second, compare rates on the actual amount you\'re sending — a $500 transfer and a $2,000 transfer may have different optimal providers. Third, check for promotions — Remitly, WorldRemit, and others regularly offer bonus rates or fee waivers for Philippine transfers. Fourth, consider sending during US business hours on weekdays when rates tend to be slightly more favorable. Finally, use 1StopRemittance to compare all providers in one place before every transfer.',
      },
    ],
    relatedSlugs: ['filipino-balikbayan-remittance-tips', 'exchange-rate-timing-tips'],
  },
  'nigerian-diaspora-remittance-guide': {
    title: 'Nigerian Diaspora Remittance Guide: What You Need to Know',
    flag: '🇳🇬',
    category: 'Nigeria',
    readTime: '10 min',
    sections: [
      {
        heading: 'The Scale of Nigerian Diaspora Remittances',
        content: 'Nigerian Americans are among the most educated and highest-earning immigrant groups in the United States. The Nigerian diaspora sends billions of dollars home annually, making remittances a critical component of Nigeria\'s economy. These funds support families, fund education, build homes, and fuel small businesses across the country. Understanding how to send money efficiently can save your family significant amounts over time.',
      },
      {
        heading: 'Navigating the NGN Exchange Rate',
        content: 'The Nigerian Naira has experienced significant depreciation and volatility. The CBN\'s move toward a unified exchange rate means that official and parallel market rates are converging, but differences still exist between providers. Some providers like Wise and Sendwave offer rates closer to the market rate, while traditional services like Western Union may use less favorable rates but offer wider cash pickup networks. Always compare the total amount your recipient will receive, not just the headline exchange rate.',
      },
      {
        heading: 'Regulatory Considerations',
        content: 'Nigeria has regulations governing inward remittances. Transfers to Nigerian bank accounts are subject to CBN guidelines. For amounts over certain thresholds, recipients may need to provide identification. Using licensed and regulated providers ensures your money arrives safely and legally. Avoid informal transfer channels (sometimes called "underground banking") as they carry significant risks and may violate laws in both the US and Nigeria.',
      },
      {
        heading: 'Building a Remittance Strategy',
        content: 'Rather than sending money reactively, consider building a strategy. Set up rate alerts for favorable NGN rates. Batch your transfers — sending $500 once instead of $100 five times saves on per-transaction fees. Keep accounts with 2-3 different providers so you can quickly switch to whoever has the best rate at any given time. And always check 1StopRemittance before sending to ensure you\'re getting the best deal available.',
      },
    ],
    relatedSlugs: ['best-ways-send-money-nigeria', 'avoid-hidden-fees-money-transfers'],
  },
  'filipino-balikbayan-remittance-tips': {
    title: 'Balikbayan Guide: Best Remittance Options for Filipinos in the US',
    flag: '🇵🇭',
    category: 'Philippines',
    readTime: '7 min',
    sections: [
      {
        heading: 'Understanding Balikbayan Remittances',
        content: 'The term "Balikbayan" literally means "returning to one\'s country" and refers to Filipinos living abroad. For millions of Filipino Americans, regular remittances are a way of life — supporting parents, siblings, children, and extended family back home. The Philippines government actively encourages remittances and has created favorable policies for overseas Filipino workers and immigrants, including tax incentives on certain remittance amounts.',
      },
      {
        heading: 'Best Providers for Balikbayan Transfers',
        content: 'Remitly is one of the top choices for Filipino Americans, offering competitive rates, instant GCash delivery, and frequent promotions specifically for Philippine corridors. Wise provides the most transparent pricing with mid-market rates. Xoom (PayPal) is reliable and well-integrated with Philippine banks. For cash pickup, Western Union and MoneyGram have extensive networks through Cebuana Lhuillier, LBC, M Lhuillier, and Palawan Pawnshop locations across the Philippines — even in remote areas.',
      },
      {
        heading: 'Digital Wallets: GCash and Maya',
        content: 'The Philippines has embraced digital wallets at an incredible pace. GCash (by Globe) and Maya (formerly PayMaya, by Smart) are used by tens of millions of Filipinos. Sending directly to these wallets is instant, free for the recipient, and incredibly convenient. Your family can use the funds to pay bills (electricity, water, internet), buy groceries, send to other GCash users, or cash out at any partner location. If your recipient uses GCash regularly, it\'s often the best delivery method.',
      },
      {
        heading: 'Maximizing Value on Every Transfer',
        content: 'Take advantage of first-time transfer bonuses — most providers offer enhanced rates or zero fees for new users. Sign up for multiple services to always have the best option available. Pay via bank transfer (ACH) instead of credit/debit card to avoid surcharges. If you send regularly, consider setting up recurring transfers when rates are favorable. And always compare on 1StopRemittance before hitting send — the rate difference between providers can mean hundreds of extra pesos for your family.',
      },
    ],
    relatedSlugs: ['cheapest-way-send-money-philippines', 'exchange-rate-timing-tips'],
  },
  'avoid-hidden-fees-money-transfers': {
    title: 'How to Avoid Hidden Fees on International Money Transfers',
    flag: '💡',
    category: 'Tips',
    readTime: '5 min',
    sections: [
      {
        heading: 'Where Fees Hide in Money Transfers',
        content: 'When a provider advertises "$0 fee" or "fee-free transfers," they\'re often making up for it with a wider exchange rate markup. The exchange rate markup is the difference between the mid-market rate (the real rate you see on Google) and the rate the provider gives you. On a $1,000 transfer to Nigeria, a 2% markup means your recipient gets about 31,000 fewer Naira. That\'s a hidden fee of roughly $20 — even though the provider said "no fees." Always look at the total amount received, not just the advertised fee.',
      },
      {
        heading: 'The Three Types of Transfer Costs',
        content: 'Every international transfer has up to three cost components: (1) The transfer fee — the upfront charge, usually $0-$10; (2) The exchange rate markup — the difference between mid-market and offered rate, often 0.5-3%; (3) Payment method surcharges — credit cards typically add 2-4% on top. Providers that show "$0 fees" are almost always making it up on #2. The only way to truly compare is to look at the bottom line: how much does your recipient actually receive?',
      },
      {
        heading: 'How to Compare Like a Pro',
        content: 'Step 1: Check the mid-market rate on Google or XE.com. Step 2: Enter your transfer amount on each provider. Step 3: Compare the "recipient gets" amount — this is the only number that matters. Step 4: Factor in speed if it matters. A provider with a slightly worse rate but instant delivery might be worth it for urgent transfers. Or, use 1StopRemittance to do all of this in one place — we show you the recipient amount for every provider side by side.',
      },
      {
        heading: 'Red Flags to Watch For',
        content: 'Be cautious of providers that: don\'t show the exchange rate upfront, charge both a fee AND have a wide rate markup, have different rates for different payment methods without clearly disclosing it, or charge "correspondent bank fees" that reduce the received amount after the transfer is sent. Stick to well-known, regulated providers and always compare before sending.',
      },
    ],
    relatedSlugs: ['best-ways-send-money-nigeria', 'cheapest-way-send-money-philippines'],
  },
  'exchange-rate-timing-tips': {
    title: 'When Is the Best Time to Send Money? Rate Timing Tips',
    flag: '📊',
    category: 'Tips',
    readTime: '4 min',
    sections: [
      {
        heading: 'Do Exchange Rates Really Change That Much?',
        content: 'Yes. Exchange rates fluctuate constantly based on economic data, central bank decisions, political events, and market sentiment. For major corridors like USD to NGN, the rate can move 2-5% in a single week. On a $1,000 transfer, that\'s the difference between your recipient getting 1,550,000 Naira or 1,620,000 Naira. For regular senders, timing your transfers strategically can save you hundreds of dollars per year.',
      },
      {
        heading: 'Best Times of Day to Send',
        content: 'Exchange rates tend to be most competitive during overlapping business hours between the US and the recipient country. For Nigerian transfers, this is roughly 8 AM - 12 PM EST when both US and Lagos markets are active. For Philippine transfers, rates may be slightly better in the early US morning when Asian markets are still open. However, the day-to-day variation is usually more significant than hour-to-hour changes, so don\'t stress too much about exact timing.',
      },
      {
        heading: 'Using Rate Alerts Effectively',
        content: 'The best strategy for non-urgent transfers is to set up rate alerts. Most comparison tools (including 1StopRemittance) can notify you when the rate for your corridor reaches a favorable level. Set a target rate based on recent history — for example, if USD/NGN has ranged between 1,500-1,600 over the past month, set an alert for 1,580 or above. When the alert triggers, make your transfer. This "rate shopping" approach consistently beats random timing.',
      },
      {
        heading: 'Dollar Cost Averaging for Regular Senders',
        content: 'If you send money home monthly, trying to time the market is stressful and often counterproductive. Instead, adopt a "dollar cost averaging" approach: send the same dollar amount at the same time each month. Over time, you\'ll buy at both high and low rates, and the average will be better than trying to guess the market. Combine this with using the cheapest provider each time (check 1StopRemittance before every transfer) for the best overall results.',
      },
    ],
    relatedSlugs: ['avoid-hidden-fees-money-transfers', 'best-ways-send-money-nigeria'],
  },
}

const ALL_GUIDES = [
  { slug: 'best-ways-send-money-nigeria', title: 'Best Ways to Send Money to Nigeria in 2026', flag: '🇳🇬', category: 'Nigeria' },
  { slug: 'cheapest-way-send-money-philippines', title: 'Cheapest Way to Send Money to the Philippines', flag: '🇵🇭', category: 'Philippines' },
  { slug: 'nigerian-diaspora-remittance-guide', title: 'Nigerian Diaspora Remittance Guide', flag: '🇳🇬', category: 'Nigeria' },
  { slug: 'filipino-balikbayan-remittance-tips', title: 'Balikbayan Guide: Best Remittance Options', flag: '🇵🇭', category: 'Philippines' },
  { slug: 'avoid-hidden-fees-money-transfers', title: 'How to Avoid Hidden Fees', flag: '💡', category: 'Tips' },
  { slug: 'exchange-rate-timing-tips', title: 'Best Time to Send Money', flag: '📊', category: 'Tips' },
]

export default function GuideDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const guide = GUIDE_CONTENT[slug]

  if (!guide) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-950 pt-28 pb-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Guide Not Found</h1>
            <Link href="/guides" className="text-emerald-400 hover:text-emerald-300">← Back to guides</Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const relatedGuides = ALL_GUIDES.filter((g) => guide.relatedSlugs.includes(g.slug))

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-950 pt-28 pb-20 px-6">
        <article className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-gray-300">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/guides" className="hover:text-gray-300">Guides</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-gray-300 truncate">{guide.title}</span>
          </nav>

          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{guide.flag}</span>
              <span className="px-3 py-1 rounded-full bg-emerald-400/10 text-emerald-400 text-xs font-medium">
                {guide.category}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-gray-500">
                <Clock className="h-3.5 w-3.5" /> {guide.readTime} read
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white sm:text-4xl">{guide.title}</h1>
          </div>

          {/* Content */}
          <div className="space-y-10">
            {guide.sections.map((section, i) => (
              <div key={i}>
                <h2 className="text-xl font-bold text-white mb-3">{section.heading}</h2>
                <p className="text-gray-400 leading-relaxed">{section.content}</p>

                {/* CTA after 2nd section */}
                {i === 1 && (
                  <div className="mt-8 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-400/20 rounded-2xl p-6">
                    <p className="text-white font-semibold mb-2">Ready to find the best deal?</p>
                    <p className="text-gray-400 text-sm mb-4">Compare rates from 8+ providers in seconds.</p>
                    <Link
                      href="/compare"
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900 font-bold rounded-xl text-sm"
                    >
                      Compare Rates Now <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Related guides */}
          {relatedGuides.length > 0 && (
            <div className="mt-16">
              <h3 className="text-xl font-bold text-white mb-6">Related Guides</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {relatedGuides.map((g) => (
                  <Link key={g.slug} href={`/guides/${g.slug}`}>
                    <div className="group bg-gray-900/50 border border-white/10 rounded-2xl p-5 hover:border-emerald-400/30 transition-colors">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{g.flag}</span>
                        <span className="text-xs text-gray-500">{g.category}</span>
                      </div>
                      <p className="text-white font-semibold group-hover:text-emerald-400 transition-colors">{g.title}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Email CTA */}
          <div className="mt-16 bg-gray-900/50 border border-white/10 rounded-3xl p-8 text-center">
            <Mail className="h-8 w-8 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Get More Remittance Tips</h3>
            <p className="text-gray-400 text-sm mb-6">Join our newsletter for weekly guides and rate alerts.</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-xl border border-white/10 bg-gray-800/60 px-5 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-emerald-400/50"
              />
              <button type="submit" className="px-6 py-3 bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900 font-bold rounded-xl text-sm">
                Subscribe
              </button>
            </form>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
