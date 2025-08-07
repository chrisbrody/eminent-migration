import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-6">Eminent Interior Design</h1>
        <p className="text-xl text-gray-600 mb-8">
          Minneapolis Interior Designers specializing in custom home design and remodeling
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="secondary" size="lg" asChild>
            <Link href="/blog">
              Blog
            </Link>
          </Button>
          <Button size="lg" asChild>
            <Link href="/projects">
              Projects
            </Link>
          </Button>
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