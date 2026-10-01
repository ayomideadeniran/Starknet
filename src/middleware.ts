import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow home page (/)
  if (pathname === '/') {
    return NextResponse.next();
  }

  // 2. Allow access to /register (and any subroutes if any)
  if (pathname === '/register' || pathname.startsWith('/register/')) {
    return NextResponse.next();
  }

  // 3. Allow support (/support)
  if (pathname === '/support' || pathname.startsWith('/support/')) {
    return NextResponse.next();
  }

  // 3b. Allow email broadcast admin tool (/email-broadcast)
  if (pathname === '/email-broadcast' || pathname.startsWith('/email-broadcast/')) {
    return NextResponse.next();
  }

  // 4. Allow API routes so registration forms, price tickers, and support can function
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // 5. Allow Next.js internals, static assets, and files with extensions (.png, .ico, .svg, .js, .css, etc.)
  if (
    pathname.startsWith('/_next') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // 6. Redirect auth endpoints (login, signup, signin) and legacy paths to /register
  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = '/register';
  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
