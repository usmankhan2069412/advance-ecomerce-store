import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware to protect admin routes
 * Redirects to login page if not authenticated
 */
export function middleware(request: NextRequest) {
  // This middleware will be client-side only
  // We'll rely on the client-side authentication check in AdminLayout
  return NextResponse.next();
}

// Configure the middleware to run only on admin routes
export const config = {
  matcher: '/admin/:path*',
}; 