import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const exchangeRates = [
  { fromCurrency: 'USD', toCurrency: 'KES', rate: 130.0, spread: 0.02 },
  { fromCurrency: 'USD', toCurrency: 'GHS', rate: 12.0, spread: 0.02 },
  { fromCurrency: 'USD', toCurrency: 'NGN', rate: 1570.0, spread: 0.02 },
  { fromCurrency: 'USD', toCurrency: 'PHP', rate: 56.0, spread: 0.02 },
  { fromCurrency: 'USD', toCurrency: 'INR', rate: 83.0, spread: 0.02 },
  { fromCurrency: 'USD', toCurrency: 'MXN', rate: 17.0, spread: 0.02 },
  { fromCurrency: 'USD', toCurrency: 'GBP', rate: 0.79, spread: 0.02 },
  { fromCurrency: 'USD', toCurrency: 'EUR', rate: 0.92, spread: 0.02 },
  { fromCurrency: 'USD', toCurrency: 'CAD', rate: 1.36, spread: 0.02 },
  { fromCurrency: 'USD', toCurrency: 'AUD', rate: 1.53, spread: 0.02 },
  // Reverse rates
  { fromCurrency: 'KES', toCurrency: 'USD', rate: 1 / 130.0, spread: 0.02 },
  { fromCurrency: 'GHS', toCurrency: 'USD', rate: 1 / 12.0, spread: 0.02 },
  { fromCurrency: 'NGN', toCurrency: 'USD', rate: 1 / 1570.0, spread: 0.02 },
  { fromCurrency: 'PHP', toCurrency: 'USD', rate: 1 / 56.0, spread: 0.02 },
  { fromCurrency: 'INR', toCurrency: 'USD', rate: 1 / 83.0, spread: 0.02 },
  { fromCurrency: 'MXN', toCurrency: 'USD', rate: 1 / 17.0, spread: 0.02 },
  { fromCurrency: 'GBP', toCurrency: 'USD', rate: 1 / 0.79, spread: 0.02 },
  { fromCurrency: 'EUR', toCurrency: 'USD', rate: 1 / 0.92, spread: 0.02 },
  { fromCurrency: 'CAD', toCurrency: 'USD', rate: 1 / 1.36, spread: 0.02 },
  { fromCurrency: 'AUD', toCurrency: 'USD', rate: 1 / 1.53, spread: 0.02 },
];

async function main() {
  console.log('Seeding exchange rates...');
  for (const rate of exchangeRates) {
    await prisma.exchangeRate.upsert({
      where: { fromCurrency_toCurrency: { fromCurrency: rate.fromCurrency, toCurrency: rate.toCurrency } },
      update: { rate: rate.rate, spread: rate.spread },
      create: rate,
    });
  }
  console.log(`Seeded ${exchangeRates.length} exchange rates.`);

  console.log('Seeding admin user...');
  const adminEmail = 'admin@1stopremittance.com';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('Admin@123456', 12);
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        firstName: 'Admin',
        lastName: 'User',
        phone: '+10000000000',
        country: 'US',
        role: 'ADMIN',
        kycStatus: 'APPROVED',
        emailVerified: true,
      },
    });
    await prisma.wallet.create({
      data: { userId: admin.id, currency: 'USD', balance: 0 },
    });
    console.log(`Admin user created: ${adminEmail}`);
  } else {
    console.log('Admin user already exists, skipping.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
