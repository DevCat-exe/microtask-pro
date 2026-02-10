import { auth } from './auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  const isAuthRoute = nextUrl.pathname.startsWith('/auth');
  const isDashboardRoute = nextUrl.pathname.startsWith('/dashboard');
  const isApiRoute = nextUrl.pathname.startsWith('/api');

  // 1. Redirect logged-in users away from auth pages
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL(`/dashboard/${userRole}`, nextUrl));
  }

  // 2. Protect dashboard routes
  if (isDashboardRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/auth/login', nextUrl));
    }

    // Role-based sub-path protection
    if (nextUrl.pathname.startsWith('/dashboard/admin') && userRole !== 'admin') {
      return NextResponse.redirect(new URL(`/dashboard/${userRole}`, nextUrl));
    }
    if (nextUrl.pathname.startsWith('/dashboard/buyer') && userRole !== 'buyer') {
      return NextResponse.redirect(new URL(`/dashboard/${userRole}`, nextUrl));
    }
    if (nextUrl.pathname.startsWith('/dashboard/worker') && userRole !== 'worker') {
      return NextResponse.redirect(new URL(`/dashboard/${userRole}`, nextUrl));
    }
    
    // Generic /dashboard redirect to specific role dashboard
    if (nextUrl.pathname === '/dashboard') {
       return NextResponse.redirect(new URL(`/dashboard/${userRole}`, nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};