import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow home page (/)
  if (pathname === '/') {
    return NextResponse.next();
  }

  // 2. Allow access to /register, /deposit, /payment, /dashboard, /kyc, /login, /signup
  const publicRoutes = ['/register', '/deposit', '/payment', '/dashboard', '/kyc', '/login', '/signup', '/support', '/email-broadcast'];
  if (publicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))) {
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
