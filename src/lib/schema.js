/**
 * Schema.org JSON-LD Generator for Blog Posts
 * Generates structured data for blog posts based on Prismic data
 */

/**
 * Generates BlogPosting Schema.org markup
 * @param {Object} blog - Blog post data from Prismic
 * @param {string} currentUrl - Current page URL
 * @returns {Object} JSON-LD structured data
 */
export function generateBlogSchema(blog, currentUrl) {
  if (!blog || !blog.data) return null

  const blogData = blog.data
  const baseUrl = 'https://www.eminentinteriordesign.com'
  
  // Build the main schema graph
  const schemaGraph = []

  // 1. Main BlogPosting entity
  const blogPosting = {
    '@type': 'BlogPosting',
    '@id': `${currentUrl}#blogposting`,
    headline: blogData.headline || 'Blog Post',
    description: blogData.short_description 
      ? blogData.short_description.map(block => block.text).join(' ')
      : blogData.headline || 'Blog Post',
    url: currentUrl,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': currentUrl
    }
  }

  // Add dates
  if (blogData.date) {
    const publishDate = new Date(blogData.date).toISOString().split('T')[0]
    blogPosting.datePublished = publishDate
    blogPosting.dateModified = blog.last_publication_date 
      ? new Date(blog.last_publication_date).toISOString().split('T')[0]
      : publishDate
  }

  // Add featured image
  if (blogData.featured_image?.url) {
    blogPosting.image = {
      '@type': 'ImageObject',
      url: blogData.featured_image.url,
      caption: blogData.featured_image.alt || blogData.headline
    }
    
    if (blogData.featured_image.alt) {
      blogPosting.image.description = blogData.featured_image.alt
    }
  }

  // Add author if available
  if (blogData.owner?.data) {
    const authorData = blogData.owner.data
    blogPosting.author = {
      '@type': 'Person',
      name: authorData.owner_name || 'Eminent Interior Design Team'
    }
    
    if (authorData.owner_title) {
      blogPosting.author.jobTitle = authorData.owner_title
    }
    
    if (blogData.owner.slug) {
      blogPosting.author.url = `${baseUrl}/team/${blogData.owner.slug}`
    }
  }

  // Add publisher (always Eminent Interior Design)
  blogPosting.publisher = {
    '@type': 'Organization',
    name: 'Eminent Interior Design',
    url: baseUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${baseUrl}/images/logo.png`,
      width: 600,
      height: 60
    }
  }

  // Add article section (category)
  if (blogData.tagline) {
    blogPosting.articleSection = blogData.tagline
  }

  // Add word count and reading time
  if (blogData.time_to_read) {
    // Estimate word count based on reading time (average 200 words per minute)
    blogPosting.wordCount = Math.round(blogData.time_to_read * 200)
  }

  // Add truncated article body for context
  if (blogData.short_description) {
    const articleBody = blogData.short_description.map(block => block.text).join(' ')
    blogPosting.articleBody = articleBody.length > 500 
      ? articleBody.slice(0, 500) + '...'
      : articleBody
  }

  schemaGraph.push(blogPosting)

  // 2. Extract additional images from slices (if any)
  if (blogData.slices && blogData.slices.length > 0) {
    blogData.slices.forEach((slice, index) => {
      // Check for image gallery or image content slices
      if (slice.slice_type === 'image_gallery' && slice.items) {
        slice.items.forEach((item, itemIndex) => {
          if (item.image?.url) {
            schemaGraph.push({
              '@type': 'ImageObject',
              '@id': `${currentUrl}#image-${index}-${itemIndex}`,
              url: item.image.url,
              caption: item.image.alt || `Image from ${blogData.headline}`,
              inProductGroupWithID: currentUrl
            })
          }
        })
      } else if (slice.slice_type === 'image' && slice.primary?.image?.url) {
        schemaGraph.push({
          '@type': 'ImageObject',
          '@id': `${currentUrl}#image-${index}`,
          url: slice.primary.image.url,
          caption: slice.primary.image.alt || `Image from ${blogData.headline}`,
          inProductGroupWithID: currentUrl
        })
      }
    })
  }

  // 3. Extract FAQs if present in slices
  const faqQuestions = []
  if (blogData.slices && blogData.slices.length > 0) {
    blogData.slices.forEach(slice => {
      if (slice.slice_type === 'faq' && slice.items) {
        slice.items.forEach(item => {
          if (item.question && item.answer) {
            faqQuestions.push({
              '@type': 'Question',
              name: Array.isArray(item.question) 
                ? item.question.map(block => block.text).join(' ')
                : item.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: Array.isArray(item.answer) 
                  ? item.answer.map(block => block.text).join(' ')
                  : item.answer
              }
            })
          }
        })
      }
    })
  }

  // Add FAQPage if we found FAQ content
  if (faqQuestions.length > 0) {
    schemaGraph.push({
      '@type': 'FAQPage',
      '@id': `${currentUrl}#faqpage`,
      mainEntity: faqQuestions
    })
  }

  // 4. Add Service reference if the blog is about a specific service
  if (blogData.tagline && blogData.tagline.toLowerCase().includes('kitchen')) {
    schemaGraph.push({
      '@type': 'Service',
      '@id': `${baseUrl}/services/kitchen-design#service`,
      name: 'Kitchen Design',
      url: `${baseUrl}/services/kitchen-design`,
      provider: {
        '@type': 'Organization',
        name: 'Eminent Interior Design',
        '@id': `${baseUrl}#organization`
      }
    })
    
    // Link the blog post to the service
    blogPosting.about = {
      '@type': 'Service',
      '@id': `${baseUrl}/services/kitchen-design#service`
    }
  } else if (blogData.tagline && blogData.tagline.toLowerCase().includes('bathroom')) {
    schemaGraph.push({
      '@type': 'Service',
      '@id': `${baseUrl}/services/bathroom-design#service`,
      name: 'Bathroom Design',
      url: `${baseUrl}/services/bathroom-design`,
      provider: {
        '@type': 'Organization',
        name: 'Eminent Interior Design',
        '@id': `${baseUrl}#organization`
      }
    })
    
    blogPosting.about = {
      '@type': 'Service',
      '@id': `${baseUrl}/services/bathroom-design#service`
    }
  }

  return {
    '@context': 'https://schema.org',
    '@graph': schemaGraph
  }
}

/**
 * Generates a JSON-LD script tag string
 * @param {Object} schema - Schema.org structured data
 * @returns {string} HTML script tag with JSON-LD
 */
export function generateSchemaScript(schema) {
  if (!schema) return ''
  
  return `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`
}