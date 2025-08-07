import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Create response
    const response = NextResponse.json({ success: true })

    // Clear the httpOnly cookie
    response.cookies.set({
      name: 'auth-token',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0 // Expire immediately
    })

    return response
  } catch (error) {
    console.error('Error clearing cookie:', error)
    return NextResponse.json({ error: 'Failed to clear cookie' }, { status: 500 })
  }
}