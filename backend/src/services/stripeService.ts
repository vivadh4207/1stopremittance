import Stripe from 'stripe';
import { config } from '../config/env';
import { logger } from '../utils/logger';
import { completeTransfer, failTransfer } from './transferService';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';

let stripeClient: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripeClient) {
    if (!config.stripe.secretKey || config.stripe.secretKey === 'sk_test_your_stripe_key') {
      throw new AppError('Stripe is not configured. Please set STRIPE_SECRET_KEY.', 503);
    }
    stripeClient = new Stripe(config.stripe.secretKey, { apiVersion: '2023-10-16' });
  }
  return stripeClient;
}

interface PaymentIntentMetadata {
  transferId?: string;
  userId: string;
  description?: string;
  [key: string]: string | undefined;
}

export async function createPaymentIntent(
  amount: number,
  currency: string,
  metadata: PaymentIntentMetadata,
): Promise<Stripe.PaymentIntent> {
  const stripe = getStripe();

  // Stripe expects amount in smallest currency unit (cents for USD)
  const amountInCents = Math.round(amount * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: currency.toLowerCase(),
    metadata: metadata as Record<string, string>,
    automatic_payment_methods: { enabled: true },
  });

  logger.info('Stripe payment intent created', {
    paymentIntentId: paymentIntent.id,
    amount,
    currency,
  });

  return paymentIntent;
}

export function constructWebhookEvent(
  payload: Buffer | string,
  signature: string,
): Stripe.Event {
  const stripe = getStripe();

  if (!config.stripe.webhookSecret || config.stripe.webhookSecret === 'whsec_your_webhook_secret') {
    throw new AppError('Stripe webhook secret is not configured', 503);
  }

  return stripe.webhooks.constructEvent(payload, signature, config.stripe.webhookSecret);
}

export async function handlePaymentSuccess(paymentIntentId: string): Promise<void> {
  const transfer = await prisma.transfer.findFirst({
    where: { stripePaymentIntentId: paymentIntentId },
  });

  if (!transfer) {
    logger.warn('No transfer found for payment intent', { paymentIntentId });
    return;
  }

  logger.info('Processing payment success for transfer', {
    transferId: transfer.id,
    paymentIntentId,
  });

  await completeTransfer(transfer.id);

  logger.info('Transfer completed successfully', { transferId: transfer.id });
}

export async function handlePaymentFailure(paymentIntentId: string): Promise<void> {
  const transfer = await prisma.transfer.findFirst({
    where: { stripePaymentIntentId: paymentIntentId },
  });

  if (!transfer) {
    logger.warn('No transfer found for failed payment intent', { paymentIntentId });
    return;
  }

  logger.info('Processing payment failure for transfer', {
    transferId: transfer.id,
    paymentIntentId,
  });

  await failTransfer(transfer.id, 'Payment failed');
}
