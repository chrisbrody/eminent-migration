import { createClient } from '../../../../lib/prismic'
import { redirectToPreviewURL } from '@prismicio/next'

export async function GET(request) {
  const client = createClient()
  
  return await redirectToPreviewURL({ client, request })
}