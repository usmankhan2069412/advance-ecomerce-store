import { NextRequest, NextResponse } from 'next/server';

// Define the expected structure of the request body
interface TryOnRequestBody {
  image: string; // Base64-encoded user image
  product_id: string; // ID of the product to try on
  options?: object; // Additional processing options (optional)
}

export async function POST(request: NextRequest) {
  let body: { product_id?: string; image?: string; options?: any };
  try {
    const body: TryOnRequestBody = await request.json(); // Ensure body is defined with the correct type

    // Validate required parameters
    if (!body.image || !body.product_id) {
      return NextResponse.json(
        { error: 'Missing required parameters: image and product_id' },
        { status: 400 }
      );
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock response
    return NextResponse.json({
      overlay_image: body.image, // In reality, this would be the processed image
      confidence_score: 0.92,
      processing_time_ms: 1500,
      fallback: {
        size_chart_url: `/products/${body.product_id}/size-chart`, // Now TypeScript knows product_id exists
        support_chat_url: '/support/chat'
      }
    });
  } catch (error) {
    console.error('Try-on processing error:', error);
    
    // Ensure 'body' is defined and accessible within the catch block
    return NextResponse.json(
      { 
        error: 'Failed to process try-on request',
        fallback: {
          size_chart_url: `/products/${body?.product_id}/size-chart`, // Optional chaining to avoid undefined error
          support_chat_url: '/support/chat'
        }
      },
      { status: 500 }
    );
  }
}