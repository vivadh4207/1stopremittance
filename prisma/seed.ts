import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Seed countries
  const countries = [
    { id: 'US', name: 'United States', currency: 'USD', phoneCode: '+1', flagEmoji: '🇺🇸', isSendFrom: true, isReceiveIn: false },
    { id: 'GB', name: 'United Kingdom', currency: 'GBP', phoneCode: '+44', flagEmoji: '🇬🇧', isSendFrom: true, isReceiveIn: true },
    { id: 'CA', name: 'Canada', currency: 'CAD', phoneCode: '+1', flagEmoji: '🇨🇦', isSendFrom: true, isReceiveIn: true },
    { id: 'AU', name: 'Australia', currency: 'AUD', phoneCode: '+61', flagEmoji: '🇦🇺', isSendFrom: true, isReceiveIn: true },
    { id: 'DE', name: 'Germany', currency: 'EUR', phoneCode: '+49', flagEmoji: '🇩🇪', isSendFrom: true, isReceiveIn: true },
    { id: 'FR', name: 'France', currency: 'EUR', phoneCode: '+33', flagEmoji: '🇫🇷', isSendFrom: true, isReceiveIn: true },
    { id: 'AE', name: 'United Arab Emirates', currency: 'AED', phoneCode: '+971', flagEmoji: '🇦🇪', isSendFrom: true, isReceiveIn: true },
    { id: 'SA', name: 'Saudi Arabia', currency: 'SAR', phoneCode: '+966', flagEmoji: '🇸🇦', isSendFrom: true, isReceiveIn: true },
    { id: 'SG', name: 'Singapore', currency: 'SGD', phoneCode: '+65', flagEmoji: '🇸🇬', isSendFrom: true, isReceiveIn: true },
    { id: 'JP', name: 'Japan', currency: 'JPY', phoneCode: '+81', flagEmoji: '🇯🇵', isSendFrom: true, isReceiveIn: true },
    { id: 'KR', name: 'South Korea', currency: 'KRW', phoneCode: '+82', flagEmoji: '🇰🇷', isSendFrom: true, isReceiveIn: true },
    { id: 'IN', name: 'India', currency: 'INR', phoneCode: '+91', flagEmoji: '🇮🇳', isSendFrom: false, isReceiveIn: true },
    { id: 'NP', name: 'Nepal', currency: 'NPR', phoneCode: '+977', flagEmoji: '🇳🇵', isSendFrom: false, isReceiveIn: true },
    { id: 'PK', name: 'Pakistan', currency: 'PKR', phoneCode: '+92', flagEmoji: '🇵🇰', isSendFrom: false, isReceiveIn: true },
    { id: 'BD', name: 'Bangladesh', currency: 'BDT', phoneCode: '+880', flagEmoji: '🇧🇩', isSendFrom: false, isReceiveIn: true },
    { id: 'LK', name: 'Sri Lanka', currency: 'LKR', phoneCode: '+94', flagEmoji: '🇱🇰', isSendFrom: false, isReceiveIn: true },
    { id: 'PH', name: 'Philippines', currency: 'PHP', phoneCode: '+63', flagEmoji: '🇵🇭', isSendFrom: false, isReceiveIn: true },
    { id: 'MX', name: 'Mexico', currency: 'MXN', phoneCode: '+52', flagEmoji: '🇲🇽', isSendFrom: false, isReceiveIn: true },
    { id: 'BR', name: 'Brazil', currency: 'BRL', phoneCode: '+55', flagEmoji: '🇧🇷', isSendFrom: false, isReceiveIn: true },
    { id: 'NG', name: 'Nigeria', currency: 'NGN', phoneCode: '+234', flagEmoji: '🇳🇬', isSendFrom: false, isReceiveIn: true },
    { id: 'KE', name: 'Kenya', currency: 'KES', phoneCode: '+254', flagEmoji: '🇰🇪', isSendFrom: false, isReceiveIn: true },
    { id: 'GH', name: 'Ghana', currency: 'GHS', phoneCode: '+233', flagEmoji: '🇬🇭', isSendFrom: false, isReceiveIn: true },
    { id: 'ZA', name: 'South Africa', currency: 'ZAR', phoneCode: '+27', flagEmoji: '🇿🇦', isSendFrom: false, isReceiveIn: true },
    { id: 'EG', name: 'Egypt', currency: 'EGP', phoneCode: '+20', flagEmoji: '🇪🇬', isSendFrom: false, isReceiveIn: true },
    { id: 'VN', name: 'Vietnam', currency: 'VND', phoneCode: '+84', flagEmoji: '🇻🇳', isSendFrom: false, isReceiveIn: true },
    { id: 'TH', name: 'Thailand', currency: 'THB', phoneCode: '+66', flagEmoji: '🇹🇭', isSendFrom: false, isReceiveIn: true },
    { id: 'MY', name: 'Malaysia', currency: 'MYR', phoneCode: '+60', flagEmoji: '🇲🇾', isSendFrom: false, isReceiveIn: true },
    { id: 'ID', name: 'Indonesia', currency: 'IDR', phoneCode: '+62', flagEmoji: '🇮🇩', isSendFrom: false, isReceiveIn: true },
    { id: 'TR', name: 'Turkey', currency: 'TRY', phoneCode: '+90', flagEmoji: '🇹🇷', isSendFrom: false, isReceiveIn: true },
    { id: 'CN', name: 'China', currency: 'CNY', phoneCode: '+86', flagEmoji: '🇨🇳', isSendFrom: false, isReceiveIn: true },
  ]

  for (const country of countries) {
    await prisma.country.upsert({
      where: { id: country.id },
      update: country,
      create: country,
    })
  }
  console.log(`Seeded ${countries.length} countries`)

  // Seed delivery methods for receive countries
  const receiveCountries = countries.filter(c => c.isReceiveIn)
  for (const country of receiveCountries) {
    const methods = ['BANK_DEPOSIT', 'MOBILE_WALLET', 'CASH_PICKUP'] as const
    for (const method of methods) {
      await prisma.countryDeliveryMethod.upsert({
        where: { countryId_deliveryMethod: { countryId: country.id, deliveryMethod: method } },
        update: {},
        create: { countryId: country.id, deliveryMethod: method },
      })
    }
  }
  console.log('Seeded delivery methods')

  // Seed corridors
  const corridors = [
    { sendCountry: 'US', receiveCountry: 'IN', sendCurrency: 'USD', receiveCurrency: 'INR', fxMarkupPercent: 1.5, min: 10, max: 25000, daily: 25000, monthly: 50000 },
    { sendCountry: 'US', receiveCountry: 'NP', sendCurrency: 'USD', receiveCurrency: 'NPR', fxMarkupPercent: 1.8, min: 10, max: 15000, daily: 15000, monthly: 30000 },
    { sendCountry: 'US', receiveCountry: 'PK', sendCurrency: 'USD', receiveCurrency: 'PKR', fxMarkupPercent: 1.5, min: 10, max: 20000, daily: 20000, monthly: 40000 },
    { sendCountry: 'US', receiveCountry: 'BD', sendCurrency: 'USD', receiveCurrency: 'BDT', fxMarkupPercent: 1.6, min: 10, max: 15000, daily: 15000, monthly: 30000 },
    { sendCountry: 'US', receiveCountry: 'PH', sendCurrency: 'USD', receiveCurrency: 'PHP', fxMarkupPercent: 1.3, min: 10, max: 20000, daily: 20000, monthly: 40000 },
    { sendCountry: 'US', receiveCountry: 'MX', sendCurrency: 'USD', receiveCurrency: 'MXN', fxMarkupPercent: 1.0, min: 10, max: 25000, daily: 25000, monthly: 50000 },
    { sendCountry: 'US', receiveCountry: 'NG', sendCurrency: 'USD', receiveCurrency: 'NGN', fxMarkupPercent: 2.0, min: 10, max: 10000, daily: 10000, monthly: 25000 },
    { sendCountry: 'US', receiveCountry: 'KE', sendCurrency: 'USD', receiveCurrency: 'KES', fxMarkupPercent: 1.8, min: 10, max: 10000, daily: 10000, monthly: 25000 },
    { sendCountry: 'GB', receiveCountry: 'IN', sendCurrency: 'GBP', receiveCurrency: 'INR', fxMarkupPercent: 1.4, min: 10, max: 25000, daily: 25000, monthly: 50000 },
    { sendCountry: 'GB', receiveCountry: 'NP', sendCurrency: 'GBP', receiveCurrency: 'NPR', fxMarkupPercent: 1.7, min: 10, max: 15000, daily: 15000, monthly: 30000 },
    { sendCountry: 'GB', receiveCountry: 'PK', sendCurrency: 'GBP', receiveCurrency: 'PKR', fxMarkupPercent: 1.5, min: 10, max: 20000, daily: 20000, monthly: 40000 },
    { sendCountry: 'CA', receiveCountry: 'IN', sendCurrency: 'CAD', receiveCurrency: 'INR', fxMarkupPercent: 1.5, min: 10, max: 20000, daily: 20000, monthly: 40000 },
    { sendCountry: 'AU', receiveCountry: 'IN', sendCurrency: 'AUD', receiveCurrency: 'INR', fxMarkupPercent: 1.5, min: 10, max: 20000, daily: 20000, monthly: 40000 },
    { sendCountry: 'AE', receiveCountry: 'IN', sendCurrency: 'AED', receiveCurrency: 'INR', fxMarkupPercent: 1.2, min: 10, max: 30000, daily: 30000, monthly: 60000 },
    { sendCountry: 'AE', receiveCountry: 'NP', sendCurrency: 'AED', receiveCurrency: 'NPR', fxMarkupPercent: 1.5, min: 10, max: 20000, daily: 20000, monthly: 40000 },
    { sendCountry: 'AE', receiveCountry: 'PK', sendCurrency: 'AED', receiveCurrency: 'PKR', fxMarkupPercent: 1.3, min: 10, max: 25000, daily: 25000, monthly: 50000 },
    { sendCountry: 'SA', receiveCountry: 'IN', sendCurrency: 'SAR', receiveCurrency: 'INR', fxMarkupPercent: 1.2, min: 10, max: 25000, daily: 25000, monthly: 50000 },
    { sendCountry: 'SA', receiveCountry: 'NP', sendCurrency: 'SAR', receiveCurrency: 'NPR', fxMarkupPercent: 1.5, min: 10, max: 20000, daily: 20000, monthly: 40000 },
    { sendCountry: 'US', receiveCountry: 'BR', sendCurrency: 'USD', receiveCurrency: 'BRL', fxMarkupPercent: 1.5, min: 10, max: 15000, daily: 15000, monthly: 30000 },
    { sendCountry: 'US', receiveCountry: 'LK', sendCurrency: 'USD', receiveCurrency: 'LKR', fxMarkupPercent: 1.7, min: 10, max: 15000, daily: 15000, monthly: 30000 },
  ]

  for (const c of corridors) {
    await prisma.corridor.upsert({
      where: { sendCurrency_receiveCurrency: { sendCurrency: c.sendCurrency, receiveCurrency: c.receiveCurrency } },
      update: {
        fxMarkupPercent: c.fxMarkupPercent,
        minTransferAmount: c.min,
        maxTransferAmount: c.max,
        dailyLimit: c.daily,
        monthlyLimit: c.monthly,
      },
      create: {
        sendCountry: c.sendCountry,
        receiveCountry: c.receiveCountry,
        sendCurrency: c.sendCurrency,
        receiveCurrency: c.receiveCurrency,
        fxMarkupPercent: c.fxMarkupPercent,
        minTransferAmount: c.min,
        maxTransferAmount: c.max,
        dailyLimit: c.daily,
        monthlyLimit: c.monthly,
      },
    })
  }
  console.log(`Seeded ${corridors.length} corridors`)

  // Seed fee tiers for major corridors
  const usdInrCorridor = await prisma.corridor.findUnique({
    where: { sendCurrency_receiveCurrency: { sendCurrency: 'USD', receiveCurrency: 'INR' } },
  })

  if (usdInrCorridor) {
    const feeTiers = [
      // Bank Transfer + Bank Deposit
      { corridorId: usdInrCorridor.id, deliveryMethod: 'BANK_DEPOSIT' as const, paymentMethod: 'BANK_TRANSFER' as const, min: 0, max: 500, feeType: 'FIXED' as const, feeValue: 0.99 },
      { corridorId: usdInrCorridor.id, deliveryMethod: 'BANK_DEPOSIT' as const, paymentMethod: 'BANK_TRANSFER' as const, min: 500, max: 2000, feeType: 'FIXED' as const, feeValue: 1.99 },
      { corridorId: usdInrCorridor.id, deliveryMethod: 'BANK_DEPOSIT' as const, paymentMethod: 'BANK_TRANSFER' as const, min: 2000, max: 25000, feeType: 'FIXED' as const, feeValue: 2.99 },
      // Debit Card + Bank Deposit
      { corridorId: usdInrCorridor.id, deliveryMethod: 'BANK_DEPOSIT' as const, paymentMethod: 'DEBIT_CARD' as const, min: 0, max: 500, feeType: 'FIXED' as const, feeValue: 2.99 },
      { corridorId: usdInrCorridor.id, deliveryMethod: 'BANK_DEPOSIT' as const, paymentMethod: 'DEBIT_CARD' as const, min: 500, max: 2000, feeType: 'FIXED' as const, feeValue: 3.99 },
      { corridorId: usdInrCorridor.id, deliveryMethod: 'BANK_DEPOSIT' as const, paymentMethod: 'DEBIT_CARD' as const, min: 2000, max: 25000, feeType: 'FIXED' as const, feeValue: 4.99 },
      // Credit Card + Bank Deposit (highest fee - revenue opportunity)
      { corridorId: usdInrCorridor.id, deliveryMethod: 'BANK_DEPOSIT' as const, paymentMethod: 'CREDIT_CARD' as const, min: 0, max: 500, feeType: 'FIXED' as const, feeValue: 4.99 },
      { corridorId: usdInrCorridor.id, deliveryMethod: 'BANK_DEPOSIT' as const, paymentMethod: 'CREDIT_CARD' as const, min: 500, max: 25000, feeType: 'HYBRID' as const, feeValue: 4.99 },
      // Mobile Wallet
      { corridorId: usdInrCorridor.id, deliveryMethod: 'MOBILE_WALLET' as const, paymentMethod: 'DEBIT_CARD' as const, min: 0, max: 25000, feeType: 'FIXED' as const, feeValue: 3.49 },
      // Cash Pickup
      { corridorId: usdInrCorridor.id, deliveryMethod: 'CASH_PICKUP' as const, paymentMethod: 'DEBIT_CARD' as const, min: 0, max: 25000, feeType: 'FIXED' as const, feeValue: 4.99 },
    ]

    for (const tier of feeTiers) {
      await prisma.feeTier.create({
        data: {
          corridorId: tier.corridorId,
          deliveryMethod: tier.deliveryMethod,
          paymentMethod: tier.paymentMethod,
          minAmount: tier.min,
          maxAmount: tier.max,
          feeType: tier.feeType,
          feeValue: tier.feeValue,
        },
      })
    }
    console.log('Seeded fee tiers for USD-INR corridor')
  }

  // Seed a demo admin user
  const adminPassword = await bcrypt.hash('admin123456', 10)
  await prisma.user.upsert({
    where: { email: 'admin@1stopremittance.com' },
    update: {},
    create: {
      email: 'admin@1stopremittance.com',
      firstName: 'Admin',
      lastName: 'User',
      passwordHash: adminPassword,
      country: 'US',
      role: 'SUPER_ADMIN',
      kycStatus: 'APPROVED',
      emailVerified: new Date(),
    },
  })
  console.log('Seeded admin user: admin@1stopremittance.com / admin123456')

  // Seed a demo customer user
  const customerPassword = await bcrypt.hash('customer123', 10)
  const customer = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      firstName: 'John',
      lastName: 'Doe',
      passwordHash: customerPassword,
      country: 'US',
      role: 'CUSTOMER',
      kycStatus: 'APPROVED',
      emailVerified: new Date(),
      subscriptionTier: 'PLUS',
    },
  })
  console.log('Seeded demo user: demo@example.com / customer123')

  // Seed sample recipients for demo user
  await prisma.recipient.upsert({
    where: { id: 'demo-recipient-1' },
    update: {},
    create: {
      id: 'demo-recipient-1',
      userId: customer.id,
      firstName: 'Rajesh',
      lastName: 'Kumar',
      country: 'IN',
      currency: 'INR',
      deliveryMethod: 'BANK_DEPOSIT',
      bankName: 'State Bank of India',
      accountNumber: '****5678',
      routingCode: 'SBIN0001234',
    },
  })

  await prisma.recipient.upsert({
    where: { id: 'demo-recipient-2' },
    update: {},
    create: {
      id: 'demo-recipient-2',
      userId: customer.id,
      firstName: 'Sita',
      lastName: 'Sharma',
      country: 'NP',
      currency: 'NPR',
      deliveryMethod: 'MOBILE_WALLET',
      mobileNumber: '+977-98XXXXXXXX',
    },
  })
  console.log('Seeded demo recipients')

  // Seed a promo
  await prisma.corridorPromotion.upsert({
    where: { promoCode: 'WELCOME50' },
    update: {},
    create: {
      name: 'Welcome Bonus',
      description: '50% off your first transfer fee',
      promoCode: 'WELCOME50',
      type: 'FEE_DISCOUNT_PERCENT',
      value: 50,
      maxUses: 10000,
      startsAt: new Date(),
      endsAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
  })

  await prisma.corridorPromotion.upsert({
    where: { promoCode: 'FREEFIRST' },
    update: {},
    create: {
      name: 'Free First Transfer',
      description: 'Your first transfer is completely free',
      promoCode: 'FREEFIRST',
      type: 'FREE_TRANSFER',
      value: 0,
      maxUses: 5000,
      startsAt: new Date(),
      endsAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
    },
  })
  console.log('Seeded promotions')

  console.log('Database seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
