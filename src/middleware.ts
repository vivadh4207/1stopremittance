import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes that don't need auth
  const publicPaths = ['/', '/login', '/register', '/forgot-password', '/verify-email', '/reset-password', '/about', '/pricing', '/help', '/legal']
  const isPublicPath = publicPaths.some(path => pathname === path || pathname.startsWith('/legal/'))

  // Public API routes
  const publicApiPaths = ['/api/auth', '/api/v1/rates', '/api/v1/corridors', '/api/webhooks']
  const isPublicApi = publicApiPaths.some(path => pathname.startsWith(path))

  if (isPublicPath || isPublicApi) {
    return NextResponse.next()
  }

  // Check for API key auth on /api/v1/* routes
  if (pathname.startsWith('/api/v1/')) {
    const apiKey = request.headers.get('x-api-key')
    if (apiKey) {
      // API key authentication - validated in the route handlers
      return NextResponse.next()
    }
  }

  // Check session token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // Redirect to login if no token
  if (!token) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Admin route protection
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const role = token.role as string
    if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { success: false, error: 'Admin access required' },
          { status: 403 }
        )
      }
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Rate limiting headers
  const response = NextResponse.next()
  response.headers.set('X-RateLimit-Limit', '100')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|fonts).*)',
  ],
}
