import { createClient } from '../../../lib/prismic'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import Image from 'next/image'
import { Tagline } from '../../components/ui/tagline'

export default async function BlogPage() {
  const { isEnabled } = await draftMode()
  const client = createClient()
  
  console.log('🔍 Draft mode enabled:', isEnabled)
  
  try {
    // Fetch all blog posts
    const blogs = await client.getAllByType('blog_page', {
      orderings: [
        { field: 'blog_page.date', direction: 'desc' }
      ],
      fetchOptions: isEnabled ? { cache: 'no-store' } : undefined
    })
    
    console.log('🔍 Blogs fetched:', blogs.length)
    
    return (
      <div className="min-h-screen bg-white">
        {/* Preview indicator */}
        {isEnabled && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
            <p className="font-bold">🎭 Preview Mode Active</p>
            <p className="text-sm">You are viewing draft content</p>
          </div>
        )}
        
        {/* Blog Section Header */}
        <div className="container mx-auto px-5 py-24">
          <div className="flex flex-col gap-10 md:gap-12 items-center">
            {/* Section Title */}
            <div className="flex flex-col max-w-xl mx-auto items-center text-center">
              {/* Tagline */}
              <Tagline variant="ghost">
                Blog
              </Tagline>
              {/* Main Heading */}
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Inspired Design
              </h1>
              {/* Description */}
              <p className="text-base text-gray-600">
                Dive Deeper
              </p>
            </div>

            {/* Blog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 w-full">
              {blogs.map((blog) => (
                <Link 
                  key={blog.id}
                  href={`/blog/${blog.uid}`}
                  className="group block transition-all duration-200"
                >
                  {/* Blog Card */}
                  <div className="flex flex-col gap-4 rounded-xl">
                    {/* Featured Image */}
                    {blog.data.featured_image?.url && (
                      <div className="aspect-[4/3] overflow-hidden rounded-xl">
                        <Image
                          src={blog.data.featured_image.url}
                          alt={blog.data.featured_image.alt || blog.data.headline}
                          width={400}
                          height={300}
                          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                        />
                      </div>
                    )}

                    {/* Post Content */}
                    <div className="flex flex-col gap-3">
                      {/* Post Meta */}
                      <div className="flex items-center gap-2 text-left">
                        <span className="text-sm text-gray-500">
                          {blog.data.date ? new Date(blog.data.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          }) : 'No date'}
                        </span>
                        <span className="text-sm text-gray-500">·</span>
                        <span className="text-sm text-gray-500">
                          {blog.data.tagline || 'Interior Design'}
                        </span>
                      </div>

                      {/* Post Title */}
                      <h2 className="text-base font-semibold leading-normal transition-colors text-gray-900 group-hover:text-blue-600 group-hover:underline">
                        {blog.data.headline}
                      </h2>

                      {/* Post Summary */}
                      <p className="text-sm leading-normal text-gray-500">
                        {blog.data.short_description 
                          ? (Array.isArray(blog.data.short_description) 
                              ? blog.data.short_description.map(block => block.text).join(' ').slice(0, 120) + (blog.data.short_description.map(block => block.text).join(' ').length > 120 ? '...' : '')
                              : blog.data.short_description.slice(0, 120) + (blog.data.short_description.length > 120 ? '...' : ''))
                          : 'No description available.'
                        }
                      </p>

                      {/* Read More Link */}
                      <div className="mt-2">
                        <span className="text-sm font-medium transition-colors inline-flex items-center text-gray-900 group-hover:text-blue-600 group-hover:underline">
                          Read More »
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Empty state if no blogs */}
            {blogs.length === 0 && (
              <div className="text-center py-12">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">No blog posts found</h2>
                <p className="text-gray-600">Check back soon for inspiring interior design content.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-5 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
            <p className="text-gray-600">Unable to load blog posts at this time.</p>
          </div>
        </div>
      </div>
    )
  }
}

// Generate metadata for SEO
export async function generateMetadata() {
  return {
    title: 'Inspired Design Blog - Eminent Interior Design',
    description: 'Explore our latest interior design insights, project showcases, and design inspiration from Eminent Interior Design.',
  }
}