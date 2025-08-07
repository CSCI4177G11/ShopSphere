import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get token from httpOnly cookie
  const cookieToken = request.cookies.get('auth-token')?.value
  
  // For API routes that need authentication
  if (request.nextUrl.pathname.startsWith('/api/') && 
      !request.nextUrl.pathname.startsWith('/api/auth/')) {
    
    // Clone headers and add auth token if available
    const requestHeaders = new Headers(request.headers)
    
    if (cookieToken) {
      requestHeaders.set('x-auth-token', cookieToken)
    }
    
    // Return response with modified headers
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}