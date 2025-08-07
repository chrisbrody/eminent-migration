import { createClient } from '../../../../lib/prismic'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import { SliceZone } from '@prismicio/react'
import { components } from '../../../../slices'
import { Tagline } from '../../../components/ui/tagline'

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
      <div className="min-h-screen bg-white">
        {/* Preview indicator */}
        {isEnabled && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
            <p className="font-bold">🎭 Preview Mode Active</p>
            <p className="text-sm">You are viewing draft content</p>
          </div>
        )}
        
        <section className="bg-background py-16 md:py-24 w-full">
          <div className="mx-auto max-w-3xl px-6 w-full">
            <article className="flex flex-col gap-12 md:gap-16 w-full">
              {/* Back button */}
              <Link 
                href="/blog"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 -mt-8 mb-4"
              >
                ← Back to Blog
              </Link>

              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-4 md:gap-5">
                  {/* Date and Category */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {blog.data.date && (
                      <p className="text-muted-foreground text-sm">
                        {new Date(blog.data.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit'
                        })}
                      </p>
                    )}
                    {blog.data.date && blog.data.tagline && (
                      <span className="text-muted-foreground text-sm">·</span>
                    )}
                    {blog.data.tagline && (
                      <Tagline variant="ghost">
                        {blog.data.tagline}
                      </Tagline>
                    )}
                  </div>

                  {/* Title */}
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                    {blog.data.headline}
                  </h1>

                  {/* Description with read time */}
                  {blog.data.short_description && (
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      {blog.data.time_to_read && `${blog.data.time_to_read} min read - `}
                      {blog.data.short_description.map((block, index) => block.text).join(' ')}
                    </p>
                  )}
                </div>

                {/* Author */}
                {blog.data.owner?.data && (
                  <div className="flex items-center gap-4">
                    {blog.data.owner.data.owner_image?.url && (
                      <div className="h-10 w-10 rounded-full overflow-hidden">
                        <Image
                          src={blog.data.owner.data.owner_image.url}
                          alt={blog.data.owner.data.owner_name}
                          width={40}
                          height={40}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <p className="text-sm font-medium">{blog.data.owner.data.owner_name}</p>
                      {blog.data.owner.data.owner_title && (
                        <p className="text-muted-foreground text-sm">
                          {blog.data.owner.data.owner_title}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Featured Image */}
                {blog.data.featured_image?.url && (
                  <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden">
                    <Image
                      src={blog.data.featured_image.url}
                      alt={blog.data.featured_image.alt || blog.data.headline}
                      fill
                      className="h-full w-full object-cover"
                      priority
                    />
                  </div>
                )}
              </div>

              {/* Slice Zone Content */}
              {blog.data.slices && blog.data.slices.length > 0 && (
                <div className="flex flex-col gap-6">
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
            </article>
          </div>
        </section>
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