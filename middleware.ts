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
    path.startsWith('/blog/') ||
    path.startsWith('/api/auth') ||
    path === '/auth/unauthorized' ||
    path.startsWith('/api/register');
  
  // Define paths that require authentication
  const isProtectedPath = 
    path === '/profile' || 
    path === '/dashboard' || 
    path === '/settings' ||
    path.startsWith('/api/users');
  
  // Define paths that require admin privileges
  const isAdminPath = 
    path.startsWith('/admin') ||
    path.startsWith('/api/admin');

  // Define paths that require editor privileges (both ADMIN and EDITOR roles)
  const isEditorPath =
    path === '/cms' ||
    path.startsWith('/cms/') ||
    path.startsWith('/api/cms');

  // Get the session token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });

  console.log(`Path: ${path}, Token:`, token);

  // If path is not public, protected, admin, or editor, proceed
  if (!isPublicPath && !isProtectedPath && !isAdminPath && !isEditorPath) {
    return NextResponse.next();
  }
  
  // Redirect logic
  if (isPublicPath && token) {
    // If user is logged in and tries to access login/register page, redirect to home
    if (path === '/auth/signIn' || path === '/auth/signUp') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    // Allow access to other public paths
    return NextResponse.next();
  }
  
  if (isPublicPath && !token) {
    // Allow access to public paths even if not logged in
    return NextResponse.next();
  }
  
  if (isProtectedPath && !token) {
    // If user is not logged in and tries to access protected route, redirect to login
    return NextResponse.redirect(new URL('/auth/signIn', request.url));
  }

  // Handle admin paths
  if (isAdminPath) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/signIn', request.url));
    }
    
    if (token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/auth/unauthorized', request.url));
    }
  }

  // Handle editor paths (requires either ADMIN or EDITOR role)
  if (isEditorPath) {
    if (!token) {
      console.log('No token found for CMS path, redirecting to login');
      return NextResponse.redirect(new URL('/auth/signIn', request.url));
    }
    
    if (token.role !== 'ADMIN' && token.role !== 'EDITOR') {
      console.log(`User role ${token.role} not authorized for CMS, redirecting to unauthorized`);
      return NextResponse.redirect(new URL('/auth/unauthorized', request.url));
    }

    console.log('Access to CMS granted for role:', token.role);
  }
  
  return NextResponse.next();
}

// Configure middleware to run on ALL paths
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};