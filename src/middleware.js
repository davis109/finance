import { NextResponse } from 'next/server';

// This empty middleware will allow all routes without authentication
export function middleware(request) {
  // Allow all requests to proceed
  return NextResponse.next();
} 