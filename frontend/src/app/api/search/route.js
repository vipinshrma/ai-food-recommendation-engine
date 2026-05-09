import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';

export async function GET(request) {
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
  const limitResult = rateLimit(ip, 10, 60000); // 10 requests per minute

  if (!limitResult.success) {
    return NextResponse.json(
      {
        success: false,
        error: "Too many requests. Please try again in a minute.",
        reset: limitResult.reset
      },
      {
        status: 429,
        headers: {
          'Retry-After': Math.ceil((limitResult.reset - Date.now()) / 1000).toString()
        }
      }
    );
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json(
      { success: false, error: "Query parameter 'q' is required." },
      { status: 400 }
    );
  }

  try {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000';
    const response = await fetch(`${backendUrl}/api/search?q=${encodeURIComponent(query)}`);
    const result = await response.json();

    if (response.ok) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: response.status });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
