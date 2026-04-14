import { NextResponse } from 'next/server'

export function GET() {
  return NextResponse.json({ error: 'Moved' }, { status: 410 })
}
