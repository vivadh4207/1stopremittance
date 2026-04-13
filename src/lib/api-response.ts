import { NextResponse } from 'next/server'

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status })
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status })
}

export function validationError(errors: Record<string, string[]>) {
  return NextResponse.json(
    { success: false, error: 'Validation failed', details: errors },
    { status: 422 }
  )
}
