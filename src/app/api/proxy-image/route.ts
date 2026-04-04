import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return new NextResponse('Missing url parameter', { status: 400 });
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
        return new NextResponse(`Failed to fetch image: ${response.status}`, { status: response.status });
    }
    const blob = await response.blob();
    const headers = new Headers();
    headers.set('Content-Type', blob.type || 'image/jpeg');
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    // Allow CORS if necessary (not strictly needed if called from same origin, but good practice)
    headers.set('Access-Control-Allow-Origin', '*');
    
    return new NextResponse(blob, { status: 200, headers });
  } catch (error) {
    return new NextResponse('Error fetching image', { status: 500 });
  }
}
