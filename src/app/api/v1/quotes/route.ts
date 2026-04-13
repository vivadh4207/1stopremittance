import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { quoteSchema } from '@/lib/validation'
import { createQuote } from '@/services/pricing/quote.service'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return errorResponse('Unauthorized', 401)
    }

    const body = await request.json()

    const result = quoteSchema.safeParse(body)
    if (!result.success) {
      const firstError = result.error.issues[0]
      return errorResponse(firstError.message, 422)
    }

    const { sendCurrency, receiveCurrency, sendAmount, deliveryMethod, paymentMethod } = result.data
    const userId = (session.user as Record<string, unknown>).id as string
    const subscriptionTier = ((session.user as Record<string, unknown>).subscriptionTier as string) || 'FREE'

    const quote = await createQuote(
      userId,
      sendCurrency,
      receiveCurrency,
      sendAmount,
      deliveryMethod,
      paymentMethod,
      subscriptionTier as 'FREE' | 'PLUS' | 'PREMIUM' | 'BUSINESS'
    )

    return successResponse(quote, 201)
  } catch (error) {
    console.error('Quote creation error:', error)
    const message = error instanceof Error ? error.message : 'Failed to create quote'
    return errorResponse(message, 500)
  }
}
