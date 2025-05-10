import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// This middleware protects admin routes
export async function adminMiddleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // Check if user is authenticated and has admin role
  if (!token || token.role !== 'ADMIN') {
    // Redirect to login or unauthorized page
    return NextResponse.redirect(new URL('/auth/unauthorized', request.url));
  }

  return NextResponse.next();
}

// This middleware protects editor routes (allows both ADMIN and EDITOR roles)
export async function editorMiddleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // Log access attempts for debugging
  console.log('Editor middleware check:', {
    path: request.nextUrl.pathname,
    hasToken: !!token,
    role: token?.role || 'none'
  });

  // Check if user is authenticated
  if (!token) {
    // Redirect to login page if not authenticated
    console.log('No token, redirecting to login');
    return NextResponse.redirect(new URL('/auth/signIn', request.url));
  }

  // Check if user has admin or editor role
  if (token.role !== 'ADMIN' && token.role !== 'EDITOR') {
    console.log('Unauthorized role for CMS access:', token.role);
    // Redirect to unauthorized page
    return NextResponse.redirect(new URL('/auth/unauthorized', request.url));
  }

  console.log('CMS access granted for role:', token.role);
  return NextResponse.next();
}