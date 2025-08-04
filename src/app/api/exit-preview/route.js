import { NextResponse } from 'next/server'

export async function GET() {
  const response = NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'))
  
  // Clear the preview cookies
  response.cookies.delete('__prerender_bypass')
  response.cookies.delete('__next_preview_data')
  
  return response
}