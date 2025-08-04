import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // Get the secret from environment variables
    const secret = process.env.PRISMIC_WEBHOOK_SECRET;
    
    // Check for secret to authenticate webhook
    const authHeader = request.headers.get('authorization');
    if (!secret || authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Revalidate all Prismic content
    revalidateTag('prismic');
    
    return NextResponse.json({ 
      message: 'Cache revalidated successfully',
      revalidated: true 
    });
    
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { message: 'Error revalidating cache' }, 
      { status: 500 }
    );
  }
}