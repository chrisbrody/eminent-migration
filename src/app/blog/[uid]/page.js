import { createClient } from '../../../../lib/prismic'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import { SliceZone } from '@prismicio/react'
import { components } from '../../../../slices'
import { Tagline } from '../../../components/ui/tagline'
import { Button } from '../../../components/ui/button'
import { generateBlogSchema } from '../../../lib/schema'

// Function to clean tagline (remove "Tips" from the end)
const cleanTagline = (tagline) => {
  if (!tagline) return tagline
  return tagline.replace(/\s+Tips$/i, '').trim()
}

export default async function BlogPage({ params }) {
  const { uid } = await params
  const { isEnabled } = await draftMode()
  const client = createClient()
  
  // Debug logging
  console.log('🔍 Draft mode enabled:', isEnabled)
  console.log('🔍 Fetching blog UID:', uid)
  
  try {
    // Fetch the blog post
    const blog = await client.getByUID('blog_detail_page', uid, {
      fetchOptions: isEnabled ? { cache: 'no-store' } : undefined
    })
    
    console.log('🔍 Blog fetched:', {
      id: blog.id,
      headline: blog.data.headline,
      lastModified: blog.last_publication_date
    })
    
    // Fetch related blogs if we have a tagline
    let relatedBlogs = []
    if (blog.data.tagline) {
      try {
        const allBlogs = await client.getAllByType('blog_detail_page', {
          fetchOptions: isEnabled ? { cache: 'no-store' } : undefined
        })
        
        // Filter related blogs by same tagline, excluding current blog
        relatedBlogs = allBlogs
          .filter(relatedBlog => 
            relatedBlog.data.tagline === blog.data.tagline && 
            relatedBlog.uid !== uid
          )
          .slice(0, 4)
      } catch (error) {
        console.error('Error fetching related blogs:', error)
      }
    }
    
    // Generate Schema.org markup
    const currentUrl = `https://eminent-migration.vercel.app/blog/${uid}`
    const blogSchema = generateBlogSchema(blog, currentUrl)

    return (
      <div className="min-h-screen bg-white">
        
        <section className="bg-background py-4 md:py-8 w-full">
          <div className="mx-auto max-w-3xl w-full">
            <div className='pb-8'>
              {/* Preview indicator */}
              {isEnabled && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
                  <p className="font-bold">🎭 Preview Mode Active</p>
                  <p className="text-sm">You are viewing draft content</p>
                </div>
              )}
            </div>
            <article className="flex flex-col w-full">
              {/* Schema.org structured data */}
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify(blogSchema),
                }}
              />
              
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
                    {blog.data.short_description.map((block) => block.text).join(' ')}
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
            {relatedBlogs.length > 0 && (
              <div className="mt-12 pt-8 border-t">
                <h2 className="text-2xl font-semibold mb-6">
                  More {cleanTagline(blog.data.tagline)} Posts
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {relatedBlogs.slice(0, 4).map((relatedBlog) => (
                    <Link 
                      key={relatedBlog.id}
                      href={`/blog/${relatedBlog.uid}`}
                      className="group block transition-all duration-200"
                    >
                      <div className="flex flex-col gap-3">
                        {/* Featured Image */}
                        {relatedBlog.data.featured_image?.url && (
                          <div className="aspect-[4/3] overflow-hidden rounded-lg">
                            <Image
                              src={relatedBlog.data.featured_image.url}
                              alt={relatedBlog.data.featured_image.alt || relatedBlog.data.headline}
                              width={300}
                              height={225}
                              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                            />
                          </div>
                        )}

                        <div className="flex flex-col gap-2">
                          {/* Post Meta */}
                          <div className="flex items-center gap-2 text-left">
                            <span className="text-sm text-gray-500">
                              {relatedBlog.data.date ? new Date(relatedBlog.data.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              }) : 'No date'}
                            </span>
                          </div>

                          {/* Post Title */}
                          <h3 className="text-base font-semibold leading-normal transition-colors text-gray-900 group-hover:text-blue-600 group-hover:underline">
                            {relatedBlog.data.headline}
                          </h3>

                          {/* Post Summary */}
                          <p className="text-sm leading-normal text-gray-500">
                            {relatedBlog.data.short_description 
                              ? relatedBlog.data.short_description.map(block => block.text).join(' ').slice(0, 100) + '...'
                              : 'No description available.'
                            }
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

              {/* View All Posts Section */}
              <div className={relatedBlogs.length > 0 ? "pt-8 border-t" : "mt-12 pt-8 border-t"}>
                <Button asChild>
                  <Link href="/blog">
                    View All Posts
                  </Link>
                </Button>
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
    
    const description = blog.data.short_description 
      ? blog.data.short_description.map(block => block.text).join(' ').slice(0, 160)
      : blog.data.headline
    
    return {
      title: blog.data.headline,
      description: description,
      openGraph: {
        title: blog.data.headline,
        description: description,
        images: blog.data.featured_image?.url ? [
          {
            url: blog.data.featured_image.url,
            alt: blog.data.featured_image.alt || blog.data.headline,
          }
        ] : [],
      },
    }
  } catch {
    return {
      title: 'Blog Post Not Found',
    }
  }
}