import { createClient } from '../../../lib/prismic'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import Image from 'next/image'

export default async function ProjectsPage() {
  const { isEnabled } = draftMode()
  const client = createClient()
  
  try {
    console.log('Attempting to fetch projects...')
    
    // Fetch all projects directly  
    const projects = await client.getAllByType('project_page', {
      fetchOptions: isEnabled ? { cache: 'no-store' } : undefined
    })
    console.log('Found projects:', projects.length)
    console.log('Project data:', projects.map(p => ({
      id: p.id,
      uid: p.uid,
      title: p.data.project_title,
      location: p.data.location,
      published: p.first_publication_date
    })))
    
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Our Projects</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Hero Image */}
              {project.data.hero_image?.url && (
                <div className="relative h-64">
                  <Image
                    src={project.data.hero_image.url}
                    alt={project.data.hero_image.alt || project.data.project_title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              
              {/* Project Info */}
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">
                  {project.data.project_title}
                </h2>
                
                <div className="text-sm text-gray-600 mb-4">
                  <p><strong>Location:</strong> {project.data.location || 'Not specified'}</p>
                  <p><strong>Type:</strong> {project.data.project_type || 'Not specified'}</p>
                  <p><strong>Room:</strong> {project.data.primary_room || 'Not specified'}</p>
                  <p><strong>Style:</strong> {project.data.design_style || 'Not specified'}</p>
                </div>
                
                {/* Project Description */}
                {project.data.project_description && (
                  <div className="text-gray-700 mb-4">
                    {project.data.project_description.map((block, index) => (
                      <p key={index}>{block.text}</p>
                    ))}
                  </div>
                )}
                
                <Link 
                  href={`/projects/${project.uid}`}
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  View Project
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        {projects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No projects found. Make sure you have created projects in Prismic.</p>
          </div>
        )}
      </div>
    )
  } catch (error) {
    console.error('Error fetching projects:', error)
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Our Projects</h1>
        <div className="text-center py-12">
          <p className="text-red-600">Error loading projects: {error.message}</p>
          <p className="text-gray-600 mt-2">Make sure your Prismic repository is set up correctly.</p>
        </div>
      </div>
    )
  }
}