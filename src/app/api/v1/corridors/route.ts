import { prisma } from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function GET() {
  try {
    const corridors = await prisma.corridor.findMany({
      where: { isActive: true },
      select: {
        id: true,
        sendCurrency: true,
        receiveCurrency: true,
        sendCountryCode: true,
        receiveCountryCode: true,
        fxMarkupPercent: true,
        minTransferAmount: true,
        maxTransferAmount: true,
        deliveryMethods: true,
        estimatedDeliveryMinutes: true,
      },
      orderBy: [{ sendCurrency: 'asc' }, { receiveCurrency: 'asc' }],
    })

    const formatted = corridors.map((c) => ({
      id: c.id,
      sendCurrency: c.sendCurrency,
      receiveCurrency: c.receiveCurrency,
      sendCountryCode: c.sendCountryCode,
      receiveCountryCode: c.receiveCountryCode,
      fxMarkupPercent: Number(c.fxMarkupPercent),
      minTransferAmount: Number(c.minTransferAmount),
      maxTransferAmount: Number(c.maxTransferAmount),
      deliveryMethods: c.deliveryMethods,
      estimatedDeliveryMinutes: c.estimatedDeliveryMinutes,
    }))

    return successResponse(formatted)
  } catch (error) {
    console.error('Corridors fetch error:', error)
    return errorResponse('Failed to fetch corridors', 500)
  }
}
