import { createClient } from '../../../../lib/prismic'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import { SliceZone } from '@prismicio/react'
import { components } from '../../../../slices'

export default async function BlogPage({ params }) {
  const { uid } = await params
  const { isEnabled } = await draftMode()
  const client = createClient()
  
  // Debug logging
  console.log('🔍 Draft mode enabled:', isEnabled)
  console.log('🔍 Fetching blog UID:', uid)
  
  try {
    const blog = await client.getByUID('blog_detail_page', uid, {
      fetchOptions: isEnabled ? { cache: 'no-store' } : undefined
    })
    
    console.log('🔍 Blog fetched:', {
      id: blog.id,
      title: blog.data.headline,
      lastModified: blog.last_publication_date,
      isDraft: blog.tags?.includes('draft') || blog.alternate_languages?.length > 0
    })
    
    return (
      <div className="container mx-auto px-4 py-8">
        {/* Preview indicator */}
        {isEnabled && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
            <p className="font-bold">🎭 Preview Mode Active</p>
            <p className="text-sm">You are viewing draft content</p>
          </div>
        )}
        
        {/* Back button */}
        <Link 
          href="/blog"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          ← Back to Blog
        </Link>
        
        {/* Featured Image */}
        {blog.data.featured_image?.url && (
          <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
            <Image
              src={blog.data.featured_image.url}
              alt={blog.data.featured_image.alt || blog.data.headline}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
        
        {/* Blog Header */}
        <div className="mb-8">
          {/* Tagline */}
          {blog.data.tagline && (
            <div className="mb-4">
              <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {blog.data.tagline}
              </span>
            </div>
          )}
          
          <h1 className="text-4xl font-bold mb-4">{blog.data.headline}</h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
            {blog.data.date && (
              <div>
                <strong>Published:</strong> {new Date(blog.data.date).toLocaleDateString()}
              </div>
            )}
            {blog.data.time_to_read && (
              <div>
                <strong>Read time:</strong> {blog.data.time_to_read} min
              </div>
            )}
            {blog.data.owner?.data && (
              <div className="flex items-center gap-2">
                <strong>Author:</strong>
                {blog.data.owner.data.owner_image?.url && (
                  <Image
                    src={blog.data.owner.data.owner_image.url}
                    alt={blog.data.owner.data.owner_name}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                )}
                <span>{blog.data.owner.data.owner_name}</span>
                {blog.data.owner.data.owner_title && (
                  <span className="text-gray-500">({blog.data.owner.data.owner_title})</span>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Short Description */}
        {blog.data.short_description && (
          <div className="prose prose-lg max-w-none mb-8">
            <div className="text-xl text-gray-700 leading-relaxed border-l-4 border-blue-200 pl-6 mb-8">
              {blog.data.short_description.map((block, index) => (
                <p key={index} className="mb-4">
                  {block.text}
                </p>
              ))}
            </div>
          </div>
        )}
        
        {/* Slice Zone */}
        {blog.data.slices && blog.data.slices.length > 0 && (
          <div className="mb-8">
            <SliceZone slices={blog.data.slices} components={components} />
          </div>
        )}
        
        {/* Related Posts Section */}
        <div className="mt-12 pt-8 border-t">
          <h2 className="text-2xl font-semibold mb-6">More Blog Posts</h2>
          <Link 
            href="/blog"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            View All Posts
          </Link>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error fetching blog:', error)
    notFound()
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { uid } = await params
  const { isEnabled } = await draftMode()
  const client = createClient()
  
  try {
    const blog = await client.getByUID('blog_detail_page', uid, {
      fetchOptions: isEnabled ? { cache: 'no-store' } : undefined
    })
    
    return {
      title: blog.data.headline,
      description: blog.data.short_description?.[0]?.text?.slice(0, 160) || `${blog.data.headline} - Blog Post`,
    }
  } catch (error) {
    return {
      title: 'Blog Post Not Found',
    }
  }
}