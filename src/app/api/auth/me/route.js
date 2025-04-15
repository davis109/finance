import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken, getUserById } from '../../../../lib/auth';

export async function GET() {
  try {
    // Get auth token from cookies
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Verify token
    const decoded = verifyToken(token);
    
    // Get user data
    const user = await getUserById(decoded.id);
    
    return NextResponse.json({ 
      success: true, 
      user
    });
  } catch (error) {
    console.error('Auth error:', error);
    
    if (error.message === 'Invalid token') {
      // Clear invalid token
      const cookieStore = cookies();
      cookieStore.delete('auth-token');
      
      return NextResponse.json(
        { error: 'Session expired. Please login again.' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Authentication failed. Please try again.' },
      { status: 500 }
    );
  }
} 