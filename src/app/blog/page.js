'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Tagline } from '../../components/ui/tagline'
import { Button } from '../../components/ui/button'

export default function BlogPage() {
  const [blogs, setBlogs] = useState([])
  const [filteredBlogs, setFilteredBlogs] = useState([])
  const [selectedFilters, setSelectedFilters] = useState(['All'])
  const [availableTaglines, setAvailableTaglines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Function to clean tagline (remove "Tips" from the end)
  const cleanTagline = (tagline) => {
    if (!tagline) return tagline
    return tagline.replace(/\s+Tips$/i, '').trim()
  }

  // Fetch blogs on mount
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('/api/blogs')
        const data = await response.json()
        
        if (!data.success) {
          throw new Error(data.details || 'Failed to fetch blogs')
        }
        
        const fetchedBlogs = data.blogs
        setBlogs(fetchedBlogs)
        setFilteredBlogs(fetchedBlogs)
        
        // Extract unique taglines that have published posts
        const taglines = [...new Set(
          fetchedBlogs
            .map(blog => blog.data.tagline)
            .filter(tagline => tagline && tagline.trim() !== '')
        )].sort()
        
        setAvailableTaglines(taglines)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching blogs:', err)
        setError(err)
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  // Filter blogs based on selected filters
  useEffect(() => {
    if (selectedFilters.includes('All')) {
      setFilteredBlogs(blogs)
    } else {
      const filtered = blogs.filter(blog => 
        selectedFilters.includes(blog.data.tagline)
      )
      setFilteredBlogs(filtered)
    }
  }, [selectedFilters, blogs])

  // Handle filter toggle
  const handleFilterToggle = (tagline) => {
    if (tagline === 'All') {
      setSelectedFilters(['All'])
    } else {
      const newFilters = selectedFilters.includes('All') 
        ? [tagline] // If 'All' was selected, replace with specific tagline
        : selectedFilters.includes(tagline)
        ? selectedFilters.filter(f => f !== tagline) // Remove if already selected
        : [...selectedFilters, tagline] // Add if not selected
      
      // If no filters selected, default to 'All'
      setSelectedFilters(newFilters.length === 0 ? ['All'] : newFilters)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-5 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
            <p className="text-gray-600">Loading blog posts...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
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

  return (
    <div className="min-h-screen bg-white">
      {/* Blog Section Header */}
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <Link 
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8"
        >
          ← Back to Home
        </Link>
        
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
            <p className="text-base text-muted-foreground">
              Dive Deeper
            </p>
          </div>

          {/* Filter Buttons */}
          {availableTaglines.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center">
              {/* All button */}
              <Button
                onClick={() => handleFilterToggle('All')}
                variant={selectedFilters.includes('All') ? 'primary' : 'secondary'}
                size="sm"
                className="cursor-pointer"
              >
                All
              </Button>
              
              {/* Category filter buttons */}
              {availableTaglines.map((tagline) => (
                <Button
                  key={tagline}
                  onClick={() => handleFilterToggle(tagline)}
                  variant={selectedFilters.includes(tagline) ? 'primary' : 'secondary'}
                  size="sm"
                  className="cursor-pointer"
                >
                  {cleanTagline(tagline)}
                </Button>
              ))}
            </div>
          )}

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 w-full">
            {filteredBlogs.map((blog) => (
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

          {/* Empty state if no filtered blogs */}
          {filteredBlogs.length === 0 && blogs.length > 0 && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">No posts found</h2>
              <p className="text-gray-600">Try selecting different categories or view all posts.</p>
            </div>
          )}

          {/* Empty state if no blogs at all */}
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
}