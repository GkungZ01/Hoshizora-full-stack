import { NextRequest, NextResponse } from 'next/server';
import { securityMiddleware, rateLimitMiddleware } from '@/middleware/security';
import { cacheMiddleware } from '@/middleware/caching';

type ApiHandler = (req: NextRequest) => Promise<NextResponse>;

interface MiddlewareOptions {
  rateLimit?: {
    enabled: boolean;
    limit?: number;
    windowMs?: number;
  };
  cache?: {
    enabled: boolean;
    maxAge?: number;
    cacheMethods?: string[];
  };
  security?: {
    enabled: boolean;
  };
}

const defaultOptions: MiddlewareOptions = {
  rateLimit: {
    enabled: true,
    limit: 100,
    windowMs: 60 * 1000 // 1 minute
  },
  cache: {
    enabled: true,
    maxAge: 60, // 1 minute
    cacheMethods: ['GET']
  },
  security: {
    enabled: true
  }
};

/**
 * Middleware wrapper for API routes
 * Applies security headers, rate limiting, and caching
 */
export function withApiMiddleware(
  handler: ApiHandler,
  options: MiddlewareOptions = defaultOptions
): ApiHandler {
  // Merge with default options
  const mergedOptions = {
    rateLimit: { ...defaultOptions.rateLimit, ...options.rateLimit },
    cache: { ...defaultOptions.cache, ...options.cache },
    security: { ...defaultOptions.security, ...options.security }
  };

  return async (req: NextRequest) => {
    try {
      // Apply rate limiting if enabled
      if (mergedOptions.rateLimit?.enabled) {
        const rateLimitResult = rateLimitMiddleware(req, {
          limit: mergedOptions.rateLimit.limit || 100,
          windowMs: mergedOptions.rateLimit.windowMs || 60 * 1000
        });
        
        if (rateLimitResult) {
          return rateLimitResult;
        }
      }

      // Apply caching if enabled
      let response: NextResponse;
      
      if (mergedOptions.cache?.enabled) {
        response = await cacheMiddleware(req, handler, {
          maxAge: mergedOptions.cache.maxAge,
          cacheMethods: mergedOptions.cache.cacheMethods
        });
      } else {
        response = await handler(req);
      }

      // Apply security headers if enabled
      if (mergedOptions.security?.enabled) {
        response = securityMiddleware(req, response);
      }

      return response;
    } catch (error) {
      console.error('API error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}