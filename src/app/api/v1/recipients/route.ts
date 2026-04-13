import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { recipientSchema } from '@/lib/validation'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return errorResponse('Unauthorized', 401)
    }

    const userId = (session.user as Record<string, unknown>).id as string

    const recipients = await prisma.recipient.findMany({
      where: { userId, isActive: true },
      orderBy: { createdAt: 'desc' },
    })

    return successResponse(recipients)
  } catch (error) {
    console.error('Recipients fetch error:', error)
    return errorResponse('Failed to fetch recipients', 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return errorResponse('Unauthorized', 401)
    }

    const body = await request.json()

    const result = recipientSchema.safeParse(body)
    if (!result.success) {
      const firstError = result.error.issues[0]
      return errorResponse(firstError.message, 422)
    }

    const userId = (session.user as Record<string, unknown>).id as string

    const recipient = await prisma.recipient.create({
      data: {
        userId,
        ...result.data,
      },
    })

    return successResponse(recipient, 201)
  } catch (error) {
    console.error('Recipient creation error:', error)
    return errorResponse('Failed to create recipient', 500)
  }
}
