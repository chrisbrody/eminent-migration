import { createClient } from '../../../../../lib/prismic'
import { draftMode } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const tagline = searchParams.get('tagline')
    const currentUid = searchParams.get('exclude')
    
    if (!tagline) {
      return NextResponse.json(
        { error: 'Tagline parameter is required', success: false },
        { status: 400 }
      )
    }
    
    const { isEnabled } = await draftMode()
    const client = createClient()
    
    console.log('🔍 API: Fetching related blogs for tagline:', tagline, 'excluding:', currentUid)
    
    // Fetch all blogs with the same tagline
    const allBlogs = await client.getAllByType('blog_detail_page', {
      fetchOptions: isEnabled ? { cache: 'no-store' } : undefined
    })
    
    // Filter by tagline and exclude current blog
    const relatedBlogs = allBlogs.filter(blog => 
      blog.data.tagline === tagline && blog.uid !== currentUid
    )
    
    // Sort by date ascending (oldest first)
    const sortedBlogs = relatedBlogs.sort((a, b) => {
      const aDate = new Date(a.data.date || 0)
      const bDate = new Date(b.data.date || 0)
      return aDate - bDate // Ascending order
    })
    
    console.log('🔍 API: Related blogs found:', sortedBlogs.length)
    
    return NextResponse.json({ 
      blogs: sortedBlogs,
      success: true,
      tagline: tagline,
      total: sortedBlogs.length
    })
  } catch (error) {
    console.error('API Error fetching related blogs:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch related blogs', 
        details: error.message,
        success: false 
      }, 
      { status: 500 }
    )
  }
}