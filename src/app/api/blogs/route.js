import { createClient } from '../../../../lib/prismic'
import { draftMode } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { isEnabled } = await draftMode()
    const client = createClient()
    
    console.log('🔍 API: Fetching blogs, draft mode:', isEnabled)
    
    const blogs = await client.getAllByType('blog_detail_page', {
      fetchOptions: isEnabled ? { cache: 'no-store' } : undefined
    })
    
    // Sort blogs: Featured first, then by date (newest first)
    const sortedBlogs = blogs.sort((a, b) => {
      // First, sort by featured status (featured blogs first)
      const aFeatured = a.data.featured_blog === true
      const bFeatured = b.data.featured_blog === true
      
      if (aFeatured !== bFeatured) {
        return bFeatured ? 1 : -1 // Featured blogs come first
      }
      
      // Then sort by date (newest first)
      const aDate = new Date(a.data.date || 0)
      const bDate = new Date(b.data.date || 0)
      return bDate - aDate
    })
    
    console.log('🔍 API: Blogs fetched and sorted:', sortedBlogs.length, 
                'Featured:', sortedBlogs.filter(blog => blog.data.featured_blog).length)
    
    return NextResponse.json({ 
      blogs: sortedBlogs,
      success: true 
    })
  } catch (error) {
    console.error('API Error fetching blogs:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch blogs', 
        details: error.message,
        success: false 
      }, 
      { status: 500 }
    )
  }
}