import { MetadataRoute } from 'next'
import { createClient } from '../../lib/prismic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const client = createClient()
  const baseUrl = 'https://eminent-migration.vercel.app'

  try {
    // Fetch all blog posts
    const blogPosts = await client.getAllByType('blog_detail_page')
    
    // Fetch all project pages
    const projectPages = await client.getAllByType('project_page')
    
    // Define static pages
    const staticPages = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 1,
      },
      {
        url: `${baseUrl}/blog`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/projects`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/team`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      },
    ]

    // Add blog post pages
    const blogPages = blogPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.uid}`,
      lastModified: post.last_publication_date 
        ? new Date(post.last_publication_date) 
        : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

    // Add project pages
    const projectPageSitemapEntries = projectPages.map((project) => ({
      url: `${baseUrl}/projects/${project.uid}`,
      lastModified: project.last_publication_date 
        ? new Date(project.last_publication_date) 
        : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

    // Combine all pages
    return [
      ...staticPages,
      ...blogPages,
      ...projectPageSitemapEntries,
    ]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    
    // Return at least static pages if Prismic fails
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 1,
      },
      {
        url: `${baseUrl}/blog`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/projects`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/team`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      },
    ]
  }
}