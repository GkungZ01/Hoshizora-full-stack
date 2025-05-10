import { NextRequest, NextResponse } from 'next/server';
import { memoryCache } from '@/lib/cache';

/**
 * Middleware for caching API responses
 */
export function cacheMiddleware(
  request: NextRequest,
  handler: (request: NextRequest) => Promise<NextResponse>,
  options: {
    maxAge?: number;
    cacheMethods?: string[];
    keyGenerator?: (req: NextRequest) => string;
  } = {}
) {
  const {
    maxAge = 60, // Default 60 seconds
    cacheMethods = ['GET'], // Default to only caching GET requests
    keyGenerator = (req) => `${req.method}:${req.nextUrl.pathname}:${req.nextUrl.search}`
  } = options;

  // Only cache the specified HTTP methods
  if (!cacheMethods.includes(request.method)) {
    return handler(request);
  }

  // Generate a cache key
  const cacheKey = keyGenerator(request);

  // Try to get from cache
  const cachedResponse = memoryCache.get<NextResponse>(cacheKey);
  
  if (cachedResponse) {
    // Clone the cached response since NextResponse objects cannot be reused
    const response = NextResponse.json(
      // We assume the cached response is a JSON response
      cachedResponse.body,
      {
        status: cachedResponse.status,
        statusText: cachedResponse.statusText,
        headers: new Headers(cachedResponse.headers)
      }
    );
    
    // Add cache-related headers
    response.headers.set('X-Cache', 'HIT');
    return response;
  }

  // If not in cache, handle the request normally
  return handler(request).then(response => {
    // Only cache successful responses
    if (response.status >= 200 && response.status < 300) {
      // We should clone the response before caching as NextResponse objects are not reusable
      memoryCache.set(cacheKey, response.clone());
    }

    // Add cache-related headers
    response.headers.set('X-Cache', 'MISS');
    response.headers.set('Cache-Control', `max-age=${maxAge}, stale-while-revalidate`);
    
    return response;
  });
}