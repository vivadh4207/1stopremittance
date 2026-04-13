import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      const transferId = paymentIntent.metadata?.transferId

      if (transferId) {
        await prisma.$transaction(async (tx) => {
          await tx.transfer.update({
            where: { id: transferId },
            data: {
              paymentStatus: 'SUCCEEDED',
              status: 'PAYMENT_RECEIVED',
            },
          })

          await tx.transferStatusLog.create({
            data: {
              transferId,
              status: 'PAYMENT_RECEIVED',
              notes: `Payment received via Stripe: ${paymentIntent.id}`,
              actor: 'system',
            },
          })
        })
      }
      break
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      const transferId = paymentIntent.metadata?.transferId

      if (transferId) {
        await prisma.$transaction(async (tx) => {
          await tx.transfer.update({
            where: { id: transferId },
            data: {
              paymentStatus: 'FAILED',
              status: 'FAILED',
            },
          })

          await tx.transferStatusLog.create({
            data: {
              transferId,
              status: 'FAILED',
              notes: `Payment failed: ${paymentIntent.last_payment_error?.message || 'Unknown error'}`,
              actor: 'system',
            },
          })
        })
      }
      break
    }

    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      const userId = subscription.metadata?.userId

      if (userId) {
        const priceId = subscription.items.data[0]?.price.id
        let tier: 'FREE' | 'PLUS' | 'PREMIUM' | 'BUSINESS' = 'FREE'

        // Map Stripe price IDs to subscription tiers
        if (priceId === process.env.STRIPE_PLUS_PRICE_ID) tier = 'PLUS'
        else if (priceId === process.env.STRIPE_PREMIUM_PRICE_ID) tier = 'PREMIUM'
        else if (priceId === process.env.STRIPE_BUSINESS_PRICE_ID) tier = 'BUSINESS'

        await prisma.user.update({
          where: { id: userId },
          data: {
            subscriptionTier: tier,
            subscriptionExpiry: new Date(subscription.current_period_end * 1000),
          },
        })
      }
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      const userId = subscription.metadata?.userId

      if (userId) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            subscriptionTier: 'FREE',
            subscriptionExpiry: null,
          },
        })
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
