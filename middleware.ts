import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const user = req.auth?.user as any;
  const userRole = user?.role;

  const isAuthRoute = nextUrl.pathname.startsWith('/auth');
  const isDashboardRoute = nextUrl.pathname.startsWith('/dashboard');

  // 1. Redirect logged-in users away from auth pages
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL(`/dashboard/${userRole || 'worker'}`, nextUrl));
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
    if (nextUrl.pathname === '/dashboard' || nextUrl.pathname === '/dashboard/') {
       return NextResponse.redirect(new URL(`/dashboard/${userRole || 'worker'}`, nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};