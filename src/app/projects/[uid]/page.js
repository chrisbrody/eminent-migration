import { createClient } from '../../../../lib/prismic'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import { SliceZone } from '@prismicio/react'
import { components } from '../../../../slices'

export default async function ProjectPage({ params }) {
  const { uid } = await params
  const { isEnabled } = await draftMode()
  const client = createClient()
  
  // Debug logging
  console.log('🔍 Draft mode enabled:', isEnabled)
  console.log('🔍 Fetching project UID:', uid)
  
  try {
    const project = await client.getByUID('project_page', uid, {
      fetchOptions: isEnabled ? { cache: 'no-store' } : undefined
    })
    
    console.log('🔍 Project fetched:', {
      id: project.id,
      title: project.data.project_title,
      lastModified: project.last_publication_date,
      isDraft: project.tags?.includes('draft') || project.alternate_languages?.length > 0
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
          href="/projects"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          ← Back to Projects
        </Link>
        
        {/* Hero Image */}
        {project.data.hero_image?.url && (
          <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
            <Image
              src={project.data.hero_image.url}
              alt={project.data.hero_image.alt || project.data.project_title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
        
        {/* Project Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{project.data.project_title}</h1>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <strong className="text-gray-600">Location:</strong>
              <p className="text-lg">{project.data.location || 'Not specified'}</p>
            </div>
            <div>
              <strong className="text-gray-600">Project Type:</strong>
              <p className="text-lg">{project.data.project_type || 'Not specified'}</p>
            </div>
            <div>
              <strong className="text-gray-600">Primary Room:</strong>
              <p className="text-lg">{project.data.primary_room || 'Not specified'}</p>
            </div>
            <div>
              <strong className="text-gray-600">Design Style:</strong>
              <p className="text-lg">{project.data.design_style || 'Not specified'}</p>
            </div>
          </div>
          
          {project.data.completion_date && (
            <div className="mt-4">
              <strong className="text-gray-600">Completion Date:</strong>
              <p className="text-lg">{new Date(project.data.completion_date).toLocaleDateString()}</p>
            </div>
          )}
        </div>
        
        {/* Project Description */}
        {project.data.project_description && (
          <div className="prose prose-lg max-w-none mb-8">
            <h2 className="text-2xl font-semibold mb-4">Project Overview</h2>
            {project.data.project_description.map((block, index) => (
              <p key={index} className="text-gray-700 leading-relaxed mb-4">
                {block.text}
              </p>
            ))}
          </div>
        )}
        
        {/* Slice Zone */}
        {project.data.slices && project.data.slices.length > 0 && (
          <div className="mb-8">
            <SliceZone slices={project.data.slices} components={components} />
          </div>
        )}
        
        {/* Related Projects Section */}
        <div className="mt-12 pt-8 border-t">
          <h2 className="text-2xl font-semibold mb-6">More Projects</h2>
          <Link 
            href="/projects"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            View All Projects
          </Link>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error fetching project:', error)
    notFound()
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { uid } = await params
  const { isEnabled } = await draftMode()
  const client = createClient()
  
  try {
    const project = await client.getByUID('project_page', uid, {
      fetchOptions: isEnabled ? { cache: 'no-store' } : undefined
    })
    
    return {
      title: project.data.project_title,
      description: project.data.project_description?.[0]?.text?.slice(0, 160) || `${project.data.project_title} - Interior Design Project`,
    }
  } catch (error) {
    return {
      title: 'Project Not Found',
    }
  }
}