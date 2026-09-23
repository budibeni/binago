import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add paths that do not require authentication
const PUBLIC_PATHS = ['/login', '/register', '/forgot-password', '/api/'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if it's a public path
  const isPublicPath = PUBLIC_PATHS.some(path => pathname.startsWith(path));
  
  // We can bypass static files and next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Get the token from cookies
  const token = request.cookies.get('access_token')?.value;

  // If there's no token and it's not a public path, redirect to login
  if (!token && !isPublicPath) {
    const loginUrl = new URL('/login', request.url);
    // Optionally save the original URL as a redirect parameter
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If there's a token and the user is trying to access login, redirect to home
  if (token && pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Config to limit middleware to specific paths if necessary
// but usually we want it to run on most paths.
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
