import { NextRequest } from 'next/server'
import { getCustomerRate } from '@/services/pricing/exchange-rate.service'
import { calculateFee } from '@/services/pricing/fee-calculator.service'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const send = searchParams.get('send')
    const receive = searchParams.get('receive')
    const amountStr = searchParams.get('amount')

    if (!send || !receive) {
      return errorResponse('Missing required query params: send, receive', 400)
    }

    const amount = amountStr ? parseFloat(amountStr) : 1000

    if (isNaN(amount) || amount <= 0) {
      return errorResponse('Amount must be a positive number', 400)
    }

    const rateResult = await getCustomerRate(send, receive)

    const feeResult = await calculateFee(
      send,
      receive,
      amount,
      'BANK_DEPOSIT',
      'DEBIT_CARD'
    )

    const receiveAmount = Math.round(amount * rateResult.customerRate * 100) / 100
    const totalCost = Math.round((amount + feeResult.finalFee) * 100) / 100

    return successResponse({
      rate: rateResult.customerRate,
      midMarketRate: rateResult.midMarketRate,
      markupPercent: rateResult.markupPercent,
      fee: feeResult.finalFee,
      feeBreakdown: feeResult,
      sendAmount: amount,
      sendCurrency: send,
      receiveAmount,
      receiveCurrency: receive,
      totalCost,
    })
  } catch (error) {
    console.error('Rate fetch error:', error)
    const message = error instanceof Error ? error.message : 'Failed to fetch rate'
    return errorResponse(message, 500)
  }
}
