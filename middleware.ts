import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Define public paths that don't require authentication
  const isPublicPath = 
    path === '/auth/signIn' || 
    path === '/auth/signUp' || 
    path === '/' ||
    path === '/about' ||
    path === '/blog' ||
    path.startsWith('/api/auth') ||
    path.startsWith('/api/register');
  
  // Define paths that require authentication
  const isProtectedPath = 
    path === '/profile' || 
    path === '/dashboard' || 
    path === '/settings' ||
    path.startsWith('/api/users');
  
  // Get the session token
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });
  
  // Redirect logic
  if (isPublicPath && token) {
    // If user is logged in and tries to access login/register page, redirect to home
    if (path === '/auth/signIn' || path === '/auth/signUp') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  if (isProtectedPath && !token) {
    // If user is not logged in and tries to access protected route, redirect to login
    return NextResponse.redirect(new URL('/auth/signIn', request.url));
  }
  
  return NextResponse.next();
}

// Configure middleware to run on specified paths
export const config = {
  matcher: [
    '/',
    '/auth/:path*',
    '/profile',
    '/dashboard',
    '/settings',
    '/api/users/:path*'
  ]
};