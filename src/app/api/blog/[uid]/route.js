import { createClient } from '../../../../../lib/prismic'
import { draftMode } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  try {
    const { uid } = await params
    const { isEnabled } = await draftMode()
    const client = createClient()
    
    console.log('🔍 API: Fetching blog by UID:', uid, 'draft mode:', isEnabled)
    
    const blog = await client.getByUID('blog_detail_page', uid, {
      fetchOptions: isEnabled ? { cache: 'no-store' } : undefined
    })
    
    console.log('🔍 API: Blog fetched:', {
      id: blog.id,
      title: blog.data.headline,
      tagline: blog.data.tagline,
      lastModified: blog.last_publication_date
    })
    
    return NextResponse.json({ 
      blog: blog,
      success: true 
    })
  } catch (error) {
    console.error('API Error fetching blog:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch blog', 
        details: error.message,
        success: false 
      }, 
      { status: 500 }
    )
  }
}