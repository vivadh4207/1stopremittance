import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { registerSchema } from '@/lib/validation'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const result = registerSchema.safeParse(body)
    if (!result.success) {
      const firstError = result.error.issues[0]
      return errorResponse(firstError.message, 422)
    }

    const { email, password, firstName, lastName, country, phone, referralCode } = result.data

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return errorResponse('An account with this email already exists', 409)
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Handle referral code
    let referredById: string | undefined
    if (referralCode) {
      const referrer = await prisma.user.findFirst({
        where: { referralCode },
      })
      if (referrer) {
        referredById = referrer.id
      }
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        country,
        phone: phone || null,
        ...(referredById ? { referredById } : {}),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        country: true,
        createdAt: true,
      },
    })

    return successResponse(user, 201)
  } catch (error) {
    console.error('Registration error:', error)
    return errorResponse('Internal server error', 500)
  }
}
