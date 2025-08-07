'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { SliceZone } from '@prismicio/react'
import { components } from '../../../../slices'
import { Tagline } from '../../../components/ui/tagline'
import { Button } from '../../../components/ui/button'

export default function BlogPage() {
  const params = useParams()
  const { uid } = params
  const [blog, setBlog] = useState(null)
  const [relatedBlogs, setRelatedBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [, setRelatedLoading] = useState(false)
  const [error, setError] = useState(null)

  // Function to clean tagline (remove "Tips" from the end)
  const cleanTagline = (tagline) => {
    if (!tagline) return tagline
    return tagline.replace(/\s+Tips$/i, '').trim()
  }

  // Fetch blog data
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`/api/blog/${uid}`)
        const data = await response.json()
        
        if (!data.success) {
          throw new Error(data.details || 'Failed to fetch blog')
        }
        
        setBlog(data.blog)
        setLoading(false)
        
        // Fetch related blogs if we have a tagline
        if (data.blog.data.tagline) {
          setRelatedLoading(true)
          const relatedResponse = await fetch(`/api/blogs/related?tagline=${encodeURIComponent(data.blog.data.tagline)}&exclude=${uid}`)
          const relatedData = await relatedResponse.json()
          
          if (relatedData.success) {
            setRelatedBlogs(relatedData.blogs)
          }
          setRelatedLoading(false)
        }
      } catch (err) {
        console.error('Error fetching blog:', err)
        setError(err)
        setLoading(false)
      }
    }

    if (uid) {
      fetchBlog()
    }
  }, [uid])

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <div className="text-center">
            <p className="text-gray-600">Loading blog post...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
            <p className="text-gray-600 mb-8">The blog post you&apos;re looking for doesn&apos;t exist.</p>
            <Button asChild>
              <Link href="/blog">
                View All Posts
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
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
}