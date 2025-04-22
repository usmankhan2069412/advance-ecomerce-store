import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware to handle authentication and protected routes
 */
export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname;

  // Check authentication status
  const hasAuthCookie = request.cookies.has('supabase-auth-token');
  const hasLocalStorageAuth = request.cookies.has('user-authenticated');
  const isAuthenticated = hasAuthCookie || hasLocalStorageAuth;

  console.log(`Middleware: Path=${path}, Auth=${isAuthenticated ? 'Yes' : 'No'}`);

  // Admin routes handling
  if (path.startsWith('/admin')) {
    // Check for admin authentication
    // For now, we'll rely on client-side auth in AdminLayout
    // But you could implement server-side admin auth check here
    return NextResponse.next();
  }

  // Protected account routes
  if (path.startsWith('/account')) {
    // If no auth cookie and no localStorage auth, redirect to login
    if (!isAuthenticated) {
      console.log('Middleware: No auth detected, redirecting to login');
      return NextResponse.redirect(new URL('/auth', request.url));
    }
  }

  // If user is authenticated and trying to access auth page, redirect to account
  if (path === '/auth') {
    // Redirect authenticated users away from auth page
    if (isAuthenticated) {
      console.log('Middleware: User is authenticated, redirecting to account page');
      return NextResponse.redirect(new URL('/account', request.url));
    }
  }

  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    '/admin/:path*',
    '/account/:path*',
    '/auth',
    '/' // Add the home page to check authentication state
  ],
};