import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for handling 301 redirects from old site URLs
 * Preserves SEO value by redirecting old blog posts and pages
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 301 Redirects for old blog URLs
  // Temporarily redirect to /music until blog posts are migrated
  // TODO: Map specific old blog posts to new URLs when blog content is created
  if (pathname.startsWith('/blog/')) {
    // Preserve any old blog post URLs with 301 redirects
    // For now, redirect to main booking page
    // When blog posts are created, map specific URLs here:
    // Example: if (pathname === '/blog/old-post-slug') return redirect('/blog/new-post-slug')

    return NextResponse.redirect(new URL('/music', request.url), 301);
  }

  // Handle old artist profile pages if they existed
  // Example: /seeyouinmydreams/ -> /music
  const oldArtistPages = [
    '/seeyouinmydreams',
    '/seeyouinmydreams/',
  ];

  if (oldArtistPages.includes(pathname)) {
    return NextResponse.redirect(new URL('/music', request.url), 301);
  }

  // Add more specific redirects here as needed
  // Format: if (pathname === '/old-url') return NextResponse.redirect(new URL('/new-url', request.url), 301);

  return NextResponse.next();
}

// Configure which paths trigger the middleware
export const config = {
  matcher: [
    // Match all paths except static files and API routes
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public/).*)',
  ],
};
