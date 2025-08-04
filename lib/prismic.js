import * as prismic from '@prismicio/client'
import { enableAutoPreviews } from '@prismicio/next'

/**
 * The project's Prismic repository name.
 */
export const repositoryName = 'eminentidmarketingsite'

/**
 * A list of Route Resolver objects that define how a document's `url` field is resolved.
 *
 * {@link https://prismic.io/docs/route-resolver#route-resolver}
 */
const routes = [
  // Only include the project type for now since that's what we have
  {
    type: 'project_page',
    path: '/projects/:uid',
  },
]

/**
 * Creates a Prismic client for the project's repository. The client is used to
 * query content from the Prismic API.
 *
 * @param config - Configuration for the Prismic client.
 */
export const createClient = (config = {}) => {
  const client = prismic.createClient(repositoryName, {
    // Add access token if available
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    // Re-enable routes now that we have the correct type name
    routes,
    fetchOptions: {
      next: {
        tags: ['prismic'],
      },
    },
    ...config,
  })

  // Enable auto previews for draft content
  enableAutoPreviews({ client })
  
  // Debug client configuration
  console.log('🔍 Prismic client created with config:', {
    repositoryName,
    hasAccessToken: !!process.env.PRISMIC_ACCESS_TOKEN,
    routesCount: routes.length
  })

  return client
}