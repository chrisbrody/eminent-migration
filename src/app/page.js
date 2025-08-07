import Link from 'next/link'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-6">Eminent Interior Design</h1>
        <p className="text-xl text-gray-600 mb-8">
          Minneapolis Interior Designers specializing in custom home design and remodeling
        </p>
        
        <div className="space-x-4">
          <Link 
            href="/projects" 
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700 transition-colors"
          >
            View Our Projects
          </Link>
          
          <Link 
            href="/blog" 
            className="inline-block border border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-lg hover:bg-blue-50 transition-colors"
          >
            Our Blog
          </Link>
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div>
          <h3 className="text-3xl font-bold text-blue-600">30+</h3>
          <p className="text-gray-600">Completed Projects</p>
        </div>
        
        <div>
          <h3 className="text-3xl font-bold text-blue-600">Twin Cities</h3>
          <p className="text-gray-600">Service Area</p>
        </div>
        
        <div>
          <h3 className="text-3xl font-bold text-blue-600">Kitchen Focus</h3>
          <p className="text-gray-600">Our Specialty</p>
        </div>
      </div>
    </div>
  )
}