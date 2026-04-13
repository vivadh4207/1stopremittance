import axios from 'axios';
import { prisma } from '../config/database';
import { config } from '../config/env';
import { logger } from '../utils/logger';

const MOCK_RATES: Record<string, number> = {
  KES: 130.0,
  GHS: 12.0,
  NGN: 1570.0,
  PHP: 56.0,
  INR: 83.0,
  MXN: 17.0,
  GBP: 0.79,
  EUR: 0.92,
  CAD: 1.36,
  AUD: 1.53,
  USD: 1.0,
};

interface RateResult {
  fromCurrency: string;
  toCurrency: string;
  midMarketRate: number;
  customerRate: number;
  spread: number;
  source: 'database' | 'api' | 'mock';
}

export async function getRate(from: string, toCurrency: string): Promise<RateResult> {
  const fromCurrency = from.toUpperCase();
  const toC = toCurrency.toUpperCase();

  // Try database first
  const dbRate = await prisma.exchangeRate.findUnique({
    where: { fromCurrency_toCurrency: { fromCurrency, toCurrency: toC } },
  });

  if (dbRate) {
    const midMarketRate = Number(dbRate.rate);
    const spread = Number(dbRate.spread);
    const customerRate = midMarketRate * (1 - spread);
    return {
      fromCurrency,
      toCurrency: toC,
      midMarketRate,
      customerRate,
      spread,
      source: 'database',
    };
  }

  // Try Open Exchange Rates API
  if (config.openExchangeRates.appId) {
    try {
      const result = await fetchFromApi(fromCurrency, toC);
      if (result) return result;
    } catch (err) {
      logger.warn('Open Exchange Rates API failed, falling back to mock', { err });
    }
  }

  // Fallback to mock rates (USD base)
  return getMockRate(fromCurrency, toC);
}

async function fetchFromApi(fromCurrency: string, toCurrency: string): Promise<RateResult | null> {
  const response = await axios.get<{ rates: Record<string, number> }>(
    `${config.openExchangeRates.baseUrl}/latest.json`,
    {
      params: { app_id: config.openExchangeRates.appId, base: 'USD' },
      timeout: 5000,
    },
  );

  const rates = response.data.rates;

  let midMarketRate: number;

  if (fromCurrency === 'USD') {
    if (!rates[toCurrency]) return null;
    midMarketRate = rates[toCurrency];
  } else if (toCurrency === 'USD') {
    if (!rates[fromCurrency]) return null;
    midMarketRate = 1 / rates[fromCurrency];
  } else {
    if (!rates[fromCurrency] || !rates[toCurrency]) return null;
    midMarketRate = rates[toCurrency] / rates[fromCurrency];
  }

  const spread = 0.02;
  const customerRate = midMarketRate * (1 - spread);

  // Cache in DB
  await prisma.exchangeRate.upsert({
    where: { fromCurrency_toCurrency: { fromCurrency, toCurrency } },
    update: { rate: midMarketRate, spread },
    create: { fromCurrency, toCurrency, rate: midMarketRate, spread },
  });

  return { fromCurrency, toCurrency, midMarketRate, customerRate, spread, source: 'api' };
}

function getMockRate(fromCurrency: string, toCurrency: string): RateResult {
  const fromUsd = MOCK_RATES[fromCurrency];
  const toUsd = MOCK_RATES[toCurrency];

  if (!fromUsd || !toUsd) {
    throw new Error(`Unsupported currency pair: ${fromCurrency}/${toCurrency}`);
  }

  const midMarketRate = toUsd / fromUsd;
  const spread = 0.02;
  const customerRate = midMarketRate * (1 - spread);

  return { fromCurrency, toCurrency, midMarketRate, customerRate, spread, source: 'mock' };
}

export async function updateRates(): Promise<void> {
  if (!config.openExchangeRates.appId) {
    logger.warn('No Open Exchange Rates app ID configured, skipping rate update');
    return;
  }

  try {
    const response = await axios.get<{ rates: Record<string, number> }>(
      `${config.openExchangeRates.baseUrl}/latest.json`,
      {
        params: { app_id: config.openExchangeRates.appId, base: 'USD' },
        timeout: 10000,
      },
    );

    const rates = response.data.rates;
    const supportedCurrencies = Object.keys(MOCK_RATES).filter((c) => c !== 'USD');
    const spread = 0.02;

    for (const currency of supportedCurrencies) {
      if (!rates[currency]) continue;
      await prisma.exchangeRate.upsert({
        where: { fromCurrency_toCurrency: { fromCurrency: 'USD', toCurrency: currency } },
        update: { rate: rates[currency], spread },
        create: { fromCurrency: 'USD', toCurrency: currency, rate: rates[currency], spread },
      });
      await prisma.exchangeRate.upsert({
        where: { fromCurrency_toCurrency: { fromCurrency: currency, toCurrency: 'USD' } },
        update: { rate: 1 / rates[currency], spread },
        create: { fromCurrency: currency, toCurrency: 'USD', rate: 1 / rates[currency], spread },
      });
    }

    logger.info(`Updated ${supportedCurrencies.length} exchange rates from Open Exchange Rates API`);
  } catch (err) {
    logger.error('Failed to update exchange rates', { err });
    throw err;
  }
}
