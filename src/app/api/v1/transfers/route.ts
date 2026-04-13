import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { transferSchema } from '@/lib/validation'
import { createTransfer, getTransfersByUser } from '@/services/transfer/transfer.service'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return errorResponse('Unauthorized', 401)
    }

    const userId = (session.user as Record<string, unknown>).id as string
    const { searchParams } = request.nextUrl
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '20', 10)

    const result = await getTransfersByUser(userId, page, limit)

    return successResponse(result)
  } catch (error) {
    console.error('Transfers fetch error:', error)
    const message = error instanceof Error ? error.message : 'Failed to fetch transfers'
    return errorResponse(message, 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return errorResponse('Unauthorized', 401)
    }

    const body = await request.json()

    const result = transferSchema.safeParse(body)
    if (!result.success) {
      const firstError = result.error.issues[0]
      return errorResponse(firstError.message, 422)
    }

    const userId = (session.user as Record<string, unknown>).id as string
    const { quoteId, recipientId } = result.data

    const transfer = await createTransfer(userId, quoteId, recipientId)

    return successResponse(transfer, 201)
  } catch (error) {
    console.error('Transfer creation error:', error)
    const message = error instanceof Error ? error.message : 'Failed to create transfer'
    return errorResponse(message, 500)
  }
}
