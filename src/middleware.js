import { NextResponse } from 'next/server';

// Routes that require authentication
const protectedRoutes = [
  '/transactions',
  '/budgets',
  '/categories',
  '/reports',
  '/dashboard',
  '/api/transactions',
  '/api/budgets',
  '/api/categories',
  '/api/statistics',
];

// Routes that should redirect authenticated users to dashboard
const authRoutes = [
  '/login',
  '/register',
];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Check for auth token
  const authToken = request.cookies.get('auth-token')?.value;
  const isAuthenticated = !!authToken;
  
  // If accessing protected route without authentication
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !isAuthenticated) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(url);
  }
  
  // If accessing auth routes while authenticated
  if (authRoutes.includes(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
} 