/**
 * 1StopRemittance – Legal Services Data Layer
 *
 * This file provides public-information-only data about business filing services.
 * We are NOT a law firm and do NOT provide legal advice. We provide document
 * preparation assistance and filing services using publicly available government
 * information, similar to LegalZoom, ZenBusiness, and Rocket Lawyer.
 *
 * DISCLAIMER: Information provided is for educational purposes only. Consult a
 * licensed attorney for legal advice.
 */

export const LEGAL_DISCLAIMER = `1StopRemittance is not a law firm and cannot provide legal advice.
We provide document preparation and business filing assistance services.
The information on this site is for general educational purposes only and
does not constitute legal, tax, or financial advice. For legal advice,
please consult a licensed attorney in your jurisdiction.`

// ─── Service Products ────────────────────────────────────────────────────────

export interface LegalProduct {
  id: string
  name: string
  description: string
  longDescription: string
  price: number
  stateFee?: string
  processingTime: string
  category: LegalCategory
  badge?: string
  popular?: boolean
  features: string[]
  icon: string
  slug: string
  faqs: FAQ[]
}

export type LegalCategory =
  | 'business-formation'
  | 'tax-ids'
  | 'compliance'
  | 'intellectual-property'
  | 'registered-agent'
  | 'immigration'

export interface FAQ {
  question: string
  answer: string
}

// ─── Products Catalog ────────────────────────────────────────────────────────

export const LEGAL_PRODUCTS: LegalProduct[] = [
  {
    id: 'llc-formation',
    name: 'LLC Formation',
    description: 'Form your Limited Liability Company in any US state. We prepare and file all documents.',
    longDescription: 'Start your LLC with confidence. We handle all the paperwork — Articles of Organization, name availability check, and state filing — using public government forms and official state procedures. Your LLC protects personal assets from business liabilities.',
    price: 79,
    stateFee: 'State fees vary ($50–$500)',
    processingTime: '1–5 business days',
    category: 'business-formation',
    badge: 'Most Popular',
    popular: true,
    icon: '🏢',
    slug: 'llc-formation',
    features: [
      'Name availability check',
      'Articles of Organization preparation',
      'State filing on your behalf',
      'Digital document delivery',
      'Compliance calendar reminders',
      'Operating Agreement template',
    ],
    faqs: [
      {
        question: 'What is an LLC?',
        answer: 'A Limited Liability Company (LLC) is a business structure that combines the liability protection of a corporation with the tax benefits and flexibility of a partnership. It protects your personal assets from business debts and lawsuits.',
      },
      {
        question: 'How long does it take to form an LLC?',
        answer: 'Most states process LLC filings within 1–5 business days. Some states offer expedited processing for an additional fee. We will notify you as soon as your LLC is approved.',
      },
      {
        question: 'Do I need a lawyer to form an LLC?',
        answer: 'No. Forming an LLC is a straightforward process using government forms available to the public. We handle the paperwork for you, but for complex business structures or legal advice specific to your situation, we recommend consulting an attorney.',
      },
      {
        question: 'What state should I form my LLC in?',
        answer: 'Most small businesses form their LLC in the state where they primarily operate. Delaware and Wyoming are popular for certain advantages, but your home state is often the most practical choice to avoid paying fees in multiple states.',
      },
    ],
  },
  {
    id: 'ein-filing',
    name: 'EIN / Tax ID Number',
    description: 'Get your federal Employer Identification Number (EIN) from the IRS. Required for business banking, hiring, and taxes.',
    longDescription: 'An EIN is a 9-digit federal tax identification number assigned by the IRS. It is required to open a business bank account, hire employees, file business taxes, and apply for business licenses. We file Form SS-4 with the IRS on your behalf.',
    price: 79,
    processingTime: 'Same day (EIN issued immediately for online applications)',
    category: 'tax-ids',
    icon: '🔢',
    slug: 'ein-filing',
    features: [
      'IRS Form SS-4 preparation',
      'Online EIN application filing',
      'Same-day EIN delivery',
      'EIN verification letter',
      'Business banking guidance',
    ],
    faqs: [
      {
        question: 'What is an EIN?',
        answer: 'An EIN (Employer Identification Number), also called a Federal Tax ID Number, is a unique 9-digit number assigned by the IRS to identify your business for tax purposes. Think of it as a Social Security number for your business.',
      },
      {
        question: 'Do I need an EIN if I have no employees?',
        answer: 'Yes, in most cases. You need an EIN to open a business bank account, file certain business tax returns (even as a sole proprietor), apply for business licenses, and build business credit.',
      },
      {
        question: 'Can I get an EIN for free myself?',
        answer: 'Yes — the IRS offers a free online EIN application at irs.gov that takes about 15 minutes. Our service handles the process for you, checks for errors, and delivers the confirmation letter.',
      },
    ],
  },
  {
    id: 'corporation-formation',
    name: 'Corporation (C-Corp / S-Corp)',
    description: 'Incorporate your business. Ideal for startups seeking investment or companies with multiple shareholders.',
    longDescription: 'Corporations offer strong liability protection and are the preferred structure for venture-backed startups. We prepare and file your Articles of Incorporation, help you understand S-Corp vs C-Corp, and provide bylaws templates.',
    price: 149,
    stateFee: 'State fees vary ($100–$800)',
    processingTime: '3–7 business days',
    category: 'business-formation',
    icon: '🏛️',
    slug: 'corporation-formation',
    features: [
      'Articles of Incorporation preparation',
      'State filing on your behalf',
      'Corporate bylaws template',
      'S-Corp vs C-Corp guidance',
      'Initial resolutions template',
      'Registered agent (1st year included)',
    ],
    faqs: [
      {
        question: 'C-Corp vs S-Corp: What is the difference?',
        answer: 'A C-Corp is a standard corporation taxed at the corporate level, preferred by startups seeking investment. An S-Corp is a pass-through entity for taxes (income flows to shareholders), with a maximum of 100 shareholders. S-Corps have more ownership restrictions.',
      },
    ],
  },
  {
    id: 'registered-agent',
    name: 'Registered Agent Service',
    description: 'Maintain a registered agent in any state to receive legal notices and official government mail.',
    longDescription: 'Every LLC and Corporation is required by law to maintain a registered agent — a person or company with a physical address in the state who is available during business hours to receive legal documents. We provide this service in all 50 states.',
    price: 99,
    processingTime: 'Same day activation',
    category: 'registered-agent',
    icon: '📬',
    slug: 'registered-agent',
    features: [
      'Registered agent in all 50 states',
      'Physical business address',
      'Instant document scanning',
      'Email & app notifications',
      'Legal notice handling',
      'Annual report reminders',
    ],
    faqs: [
      {
        question: 'Is a registered agent required by law?',
        answer: 'Yes. All LLCs and corporations are legally required to designate a registered agent in every state where they do business. Failing to maintain a registered agent can result in your business losing good standing.',
      },
    ],
  },
  {
    id: 'trademark-registration',
    name: 'Trademark Registration',
    description: 'Protect your brand name, logo, and slogan with a federal trademark through the USPTO.',
    longDescription: 'A federal trademark gives you exclusive rights to use your brand name, logo, or slogan in commerce nationwide. We prepare and file your trademark application with the USPTO, conduct a comprehensive availability search, and monitor your application status.',
    price: 299,
    stateFee: 'USPTO fees: $250–$350 per class',
    processingTime: '8–12 months (USPTO processing time)',
    category: 'intellectual-property',
    icon: '™️',
    slug: 'trademark-registration',
    features: [
      'Comprehensive trademark search',
      'USPTO application preparation',
      'Application filing on your behalf',
      'Office action monitoring',
      'Status updates throughout process',
      'Digital trademark certificate',
    ],
    faqs: [
      {
        question: 'Why should I register a trademark?',
        answer: 'A registered trademark gives you exclusive nationwide rights to use your brand identity, the right to sue infringers in federal court, and provides a legal presumption of ownership. Without registration, your rights are limited to the geographic area where you use the mark.',
      },
    ],
  },
  {
    id: 'annual-report',
    name: 'Annual Report Filing',
    description: 'Stay in compliance. We file your required annual report with the state on your behalf.',
    longDescription: 'Most states require LLCs and corporations to file an annual report to maintain good standing. Missing the deadline can result in penalties and dissolution of your business. We track your deadlines and file on time.',
    price: 99,
    stateFee: 'State fees included',
    processingTime: '1–3 business days',
    category: 'compliance',
    icon: '📋',
    slug: 'annual-report',
    features: [
      'Deadline tracking and reminders',
      'Annual report preparation',
      'State filing on your behalf',
      'Good standing certificate',
      'Filing confirmation',
    ],
    faqs: [
      {
        question: 'What happens if I miss my annual report deadline?',
        answer: 'Penalties vary by state but typically include late fees ranging from $25 to $500+. If reports are not filed, the state may administratively dissolve your business, losing your liability protection and other benefits.',
      },
    ],
  },
  {
    id: 'dba-filing',
    name: 'DBA / Fictitious Business Name',
    description: 'Register a "Doing Business As" (DBA) name to operate under a different name than your legal entity.',
    longDescription: 'A DBA (also called a fictitious business name, assumed name, or trade name) lets your business operate under a different name. Required in most states if your business name differs from your legal name.',
    price: 49,
    stateFee: 'State/county fees: $10–$100',
    processingTime: '1–5 business days',
    category: 'business-formation',
    icon: '✏️',
    slug: 'dba-filing',
    features: [
      'DBA name availability check',
      'State/county filing',
      'Publication requirements assistance',
      'Digital filing confirmation',
    ],
    faqs: [
      {
        question: 'Do I need a DBA?',
        answer: 'You need a DBA if you want to operate your business under a name other than your legal business name, open a business bank account under that name, or advertise and sign contracts under that name.',
      },
    ],
  },
  {
    id: 'itin-application',
    name: 'ITIN Application',
    description: 'Apply for an Individual Taxpayer Identification Number (ITIN) for non-US citizens who need to file US taxes.',
    longDescription: 'An ITIN is a tax processing number issued by the IRS for individuals who are not eligible for a Social Security Number. Essential for immigrants, non-resident aliens, and their dependents who need to file US tax returns. We prepare IRS Form W-7 on your behalf.',
    price: 149,
    processingTime: '6–10 weeks (IRS processing time)',
    category: 'tax-ids',
    badge: 'For Immigrants',
    icon: '🌎',
    slug: 'itin-application',
    features: [
      'Form W-7 preparation',
      'Document checklist',
      'Application review',
      'IRS submission guidance',
      'Status tracking support',
    ],
    faqs: [
      {
        question: 'Who needs an ITIN?',
        answer: 'You need an ITIN if you are not eligible for a Social Security Number but need to: file a US tax return, claim tax treaty benefits, open a US bank account at some institutions, or apply for a US mortgage.',
      },
      {
        question: 'Is an ITIN the same as a work permit?',
        answer: 'No. An ITIN does not authorize you to work in the US, provide eligibility for Social Security benefits, or serve as identification outside the tax system. It is only for federal tax purposes.',
      },
    ],
  },
]

// ─── Public Information Database ─────────────────────────────────────────────

export interface PublicInfoTopic {
  id: string
  title: string
  summary: string
  source: string
  sourceUrl: string
  category: string
  keywords: string[]
  content: string
}

export const PUBLIC_INFO_DATABASE: PublicInfoTopic[] = [
  {
    id: 'how-to-form-llc',
    title: 'How to Form an LLC (Official Government Process)',
    summary: 'Step-by-step official process for forming an LLC in the United States.',
    source: 'IRS / SBA.gov',
    sourceUrl: 'https://www.sba.gov/business-guide/launch-your-business/choose-business-structure',
    category: 'Business Formation',
    keywords: ['LLC', 'limited liability company', 'business formation', 'articles of organization'],
    content: `To form an LLC in the United States:
1. Choose a state to register in (most choose their home state)
2. Choose a name that complies with your state's LLC naming rules
3. Designate a registered agent (a person or company with a physical address in the state)
4. File Articles of Organization with your state's Secretary of State office
5. Pay the state filing fee (typically $50–$500 depending on state)
6. Create an Operating Agreement (required in some states, recommended in all)
7. Obtain necessary licenses and permits
8. Apply for an EIN from the IRS if you have employees or multiple members
9. Open a business bank account
10. File annual reports as required by your state

Source: Small Business Administration (sba.gov)`,
  },
  {
    id: 'what-is-ein',
    title: 'What is an EIN and How to Get One Free',
    summary: 'Official IRS information about Employer Identification Numbers.',
    source: 'IRS.gov',
    sourceUrl: 'https://www.irs.gov/businesses/small-businesses-self-employed/employer-id-numbers',
    category: 'Tax IDs',
    keywords: ['EIN', 'employer identification number', 'tax ID', 'IRS', 'SS-4'],
    content: `An Employer Identification Number (EIN) is a unique 9-digit number assigned by the IRS.

You need an EIN if you:
- Have employees
- Operate your business as a corporation or partnership
- File certain tax returns (employment, excise, or alcohol/tobacco/firearms)
- Withhold taxes on income paid to a non-resident alien

How to get an EIN for FREE:
1. Apply online at irs.gov/ein (available Mon–Fri, 7am–10pm ET)
2. Complete and mail Form SS-4
3. Apply by fax (receive EIN in 4 business days)
4. Apply by phone if outside the US: 267-941-1099

Online EINs are issued immediately. There is no fee for applying directly through the IRS.

Source: Internal Revenue Service (irs.gov)`,
  },
  {
    id: 'remittance-regulations',
    title: 'US Regulations on International Money Transfers',
    summary: 'CFPB rules and federal regulations governing international remittances.',
    source: 'CFPB / FinCEN',
    sourceUrl: 'https://www.consumerfinance.gov/consumer-tools/sending-money/',
    category: 'Remittance',
    keywords: ['remittance', 'international wire', 'CFPB', 'FinCEN', 'money transfer', 'regulations'],
    content: `International Money Transfer Regulations in the US:

Consumer Financial Protection Bureau (CFPB) Protections:
- You must receive a disclosure before sending including exchange rate, fees, and delivery date
- You have the right to cancel within 30 minutes of sending (for most transfers)
- The provider must resolve errors within defined timeframes
- You can dispute unauthorized or incorrect transactions

FinCEN Requirements:
- Money transfers over $10,000 must be reported to FinCEN
- Banks must file Suspicious Activity Reports (SARs) for suspicious transfers
- All remittance companies must register as Money Services Businesses (MSBs)

For Senders:
- Keep records of all transfers
- Verify recipient details before sending
- Use licensed, regulated providers only
- Compare rates at 1StopRemittance before sending

Source: Consumer Financial Protection Bureau (consumerfinance.gov)`,
  },
  {
    id: 'immigrant-business-rights',
    title: 'Immigrant Business Owner Rights & Resources',
    summary: 'Legal rights and resources for immigrant entrepreneurs in the United States.',
    source: 'SBA.gov / USCIS',
    sourceUrl: 'https://www.sba.gov',
    category: 'Immigration',
    keywords: ['immigrant business', 'visa', 'work permit', 'DACA', 'entrepreneur', 'business rights'],
    content: `Immigrant entrepreneurs have the right to:
1. Form an LLC or corporation regardless of immigration status (in most states)
2. Obtain an ITIN to file taxes if they don't have an SSN
3. Apply for business loans (availability varies by status)
4. Apply for Small Business Administration (SBA) resources

Popular visa categories for entrepreneurs:
- E-2 Investor Visa: For substantial investment in a US business
- L-1 Visa: For intracompany transferees
- O-1 Visa: For individuals with extraordinary ability
- EB-5 Visa: Investor immigration (minimum $800,000 investment)

USCIS International Entrepreneur Rule:
Certain foreign entrepreneurs may be eligible for parole into the US to start or scale a business. Must have a US startup, raise at least $250,000 from US investors, or secure at least $100,000 in government grants.

Source: SBA.gov, USCIS.gov`,
  },
]

// ─── Keyword / SEO Data ───────────────────────────────────────────────────────

export const SEO_KEYWORDS = {
  remittance: [
    'send money to nigeria',
    'send money to philippines',
    'cheapest way to send money internationally',
    'best money transfer service',
    'western union alternatives',
    'wise vs remitly',
    'international money transfer comparison',
    'remittance rates today',
    'NGN exchange rate',
    'PHP exchange rate',
    'Nigerian diaspora remittance',
    'Filipino balikbayan',
    'send money to india cheapest',
    'dollar to naira today',
    'dollar to peso today',
  ],
  legal: [
    'form an LLC online',
    'cheap LLC formation',
    'LLC formation service',
    'how to start an LLC',
    'EIN number online',
    'get federal tax ID number',
    'business registration service',
    'incorporate online',
    'registered agent service',
    'trademark registration online',
    'DBA filing service',
    'annual report filing',
    'LLC vs corporation',
    'cheapest way to form LLC',
    'LegalZoom alternative',
    'ZenBusiness alternative',
    'ITIN application service',
    'immigrant business formation',
  ],
  combined: [
    '1stop business services',
    'remittance and business services',
    'all-in-one business platform',
    'diaspora business tools',
    'immigrant entrepreneur resources',
    'Nigerian American business',
    'Filipino American business',
  ],
}

// ─── Chat Bot Knowledge Base ──────────────────────────────────────────────────

export interface BotIntent {
  id: string
  keywords: string[]
  response: string
  action?: {
    label: string
    href: string
  }
}

export const BOT_INTENTS: BotIntent[] = [
  {
    id: 'compare-rates',
    keywords: ['compare', 'rates', 'best rate', 'cheapest', 'exchange rate', 'how much', 'cost to send'],
    response: "I can help you find the best rates! Our rate comparison tool shows live prices from 8+ providers including Wise, Remitly, and Western Union. You can compare fees, exchange rates, and delivery speed side-by-side.",
    action: { label: 'Compare Rates Now →', href: '/compare' },
  },
  {
    id: 'send-nigeria',
    keywords: ['nigeria', 'lagos', 'abuja', 'naira', 'NGN', 'send to nigeria'],
    response: "Sending money to Nigeria? We compare all major providers for USD→NGN transfers. Current mid-market rates are updated live. Popular options include Wise (usually best rates), Remitly, and WorldRemit.",
    action: { label: 'See Nigeria Rates →', href: '/corridors/usd-to-ngn' },
  },
  {
    id: 'send-philippines',
    keywords: ['philippines', 'manila', 'peso', 'PHP', 'GCash', 'send to philippines'],
    response: "Sending money to the Philippines? We track the best USD→PHP rates from providers that support GCash, bank deposit, and cash pickup. Remitly and Wise consistently offer competitive rates.",
    action: { label: 'See Philippines Rates →', href: '/corridors/usd-to-php' },
  },
  {
    id: 'form-llc',
    keywords: ['LLC', 'limited liability', 'start a business', 'form a company', 'incorporate', 'business formation'],
    response: "Ready to start your business? We offer LLC formation starting at $79 + state fees. We handle all the paperwork — name check, Articles of Organization, and state filing. You'll typically be approved within 1–5 days.",
    action: { label: 'Form Your LLC →', href: '/legal-services/llc-formation' },
  },
  {
    id: 'ein-info',
    keywords: ['EIN', 'tax ID', 'employer identification', 'business tax number', 'IRS number'],
    response: "Need an EIN (Employer Identification Number)? It's required for business banking, hiring, and taxes. We can file for your EIN with the IRS — typically issued the same day. It's also available free directly at irs.gov.",
    action: { label: 'Get Your EIN →', href: '/legal-services/ein-filing' },
  },
  {
    id: 'legal-services',
    keywords: ['legal', 'business services', 'trademark', 'register', 'annual report', 'DBA', 'registered agent'],
    response: "We offer a full range of business formation and compliance services — LLC formation, EIN filing, trademark registration, registered agent services, and annual report filing. No legal advice, just document preparation using official government forms.",
    action: { label: 'View All Services →', href: '/legal-services' },
  },
  {
    id: 'itin',
    keywords: ['ITIN', 'individual taxpayer', 'no SSN', 'no social security', 'immigrant taxes', 'W-7'],
    response: "If you don't have a Social Security Number, an ITIN lets you file US taxes, open some bank accounts, and qualify for certain loans. We prepare Form W-7 for your ITIN application.",
    action: { label: 'Apply for ITIN →', href: '/legal-services/itin-application' },
  },
  {
    id: 'about',
    keywords: ['about', 'who are you', 'what is 1stop', 'what do you do', 'services'],
    response: "1StopRemittance is your all-in-one platform for remittance comparison AND business services. We help diaspora communities send money smarter AND start businesses in the US. We compare 8+ money transfer services live and offer document preparation for LLCs, EINs, trademarks, and more.",
    action: { label: 'Learn More →', href: '/about' },
  },
  {
    id: 'pricing',
    keywords: ['price', 'cost', 'how much', 'fee', 'affordable', 'pricing'],
    response: "Our document preparation services start from $49 (DBA filing) to $299 (trademark). LLC formation is $79 + state fees, EIN filing is $79. Remittance comparison is always FREE — we make money when you click through to providers.",
    action: { label: 'See All Pricing →', href: '/legal-services' },
  },
  {
    id: 'fallback',
    keywords: [],
    response: "I'm not sure about that — let me point you to the right place. You can compare remittance rates, form a business, get an EIN, or find guides in our resource center. What can I help you with?",
    action: { label: 'Browse All Services →', href: '/' },
  },
]

export function matchBotIntent(query: string): BotIntent {
  const lower = query.toLowerCase()
  for (const intent of BOT_INTENTS) {
    if (intent.id === 'fallback') continue
    if (intent.keywords.some((kw) => lower.includes(kw.toLowerCase()))) {
      return intent
    }
  }
  return BOT_INTENTS.find((i) => i.id === 'fallback')!
}
