import { NextRequest, NextResponse } from 'next/server';

/**
 * Security middleware to add security headers to all responses
 */
export function securityMiddleware(request: NextRequest, response: NextResponse): NextResponse {
  // Add security headers
  const headers = response.headers;
  
  // Prevent XSS attacks
  headers.set('X-XSS-Protection', '1; mode=block');
  
  // Prevent MIME type sniffing
  headers.set('X-Content-Type-Options', 'nosniff');
  
  // Prevent clickjacking
  headers.set('X-Frame-Options', 'DENY');
  
  // Content Security Policy
  headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; img-src 'self' data: https:; font-src 'self' data: https:; connect-src 'self' https://api.github.com; frame-ancestors 'none';"
  );
  
  // Referrer policy
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions policy
  headers.set(
    'Permissions-Policy',
    'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()'
  );

  return response;
}

/**
 * Rate limiting middleware
 */
const ipRequests = new Map<string, { count: number; timestamp: number }>();

export function rateLimitMiddleware(
  request: NextRequest,
  options = { limit: 100, windowMs: 60 * 1000 } // Default: 100 requests per minute
) {
  const ip = request.ip || 'unknown';
  const now = Date.now();
  
  // Clean up old entries
  for (const [key, data] of ipRequests.entries()) {
    if (now - data.timestamp > options.windowMs) {
      ipRequests.delete(key);
    }
  }
  
  // Get or create request data for this IP
  const requestData = ipRequests.get(ip) || { count: 0, timestamp: now };
  
  // If this is a new window, reset the count
  if (now - requestData.timestamp > options.windowMs) {
    requestData.count = 0;
    requestData.timestamp = now;
  }
  
  // Increment request count
  requestData.count++;
  ipRequests.set(ip, requestData);
  
  // Check if rate limit exceeded
  if (requestData.count > options.limit) {
    return NextResponse.json(
      { error: 'Too many requests, please try again later.' },
      { status: 429, headers: { 'Retry-After': Math.ceil((requestData.timestamp + options.windowMs - now) / 1000).toString() } }
    );
  }
  
  return null; // Continue to next middleware
}