import { prisma } from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function GET() {
  try {
    const corridors = await prisma.corridor.findMany({
      where: { isActive: true },
      select: {
        id: true,
        sendCountry: true,
        receiveCountry: true,
        sendCurrency: true,
        receiveCurrency: true,
        fxMarkupPercent: true,
        minTransferAmount: true,
        maxTransferAmount: true,
      },
      orderBy: [{ sendCurrency: 'asc' }, { receiveCurrency: 'asc' }],
    })

    const formatted = corridors.map((c) => ({
      id: c.id,
      sendCountry: c.sendCountry,
      receiveCountry: c.receiveCountry,
      sendCurrency: c.sendCurrency,
      receiveCurrency: c.receiveCurrency,
      fxMarkupPercent: Number(c.fxMarkupPercent),
      minTransferAmount: Number(c.minTransferAmount),
      maxTransferAmount: Number(c.maxTransferAmount),
    }))

    return successResponse(formatted)
  } catch (error) {
    console.error('Corridors fetch error:', error)
    return errorResponse('Failed to fetch corridors', 500)
  }
}
