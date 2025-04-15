import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Force dynamic rendering - this prevents static generation errors
export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    // Clear the auth cookie
    const cookieStore = cookies();
    cookieStore.delete('auth-token');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Logout successful' 
    });
  } catch (error) {
    console.error('Logout error:', error);
    
    return NextResponse.json(
      { error: 'Logout failed. Please try again.' },
      { status: 500 }
    );
  }
}

// Also handle GET requests for simple browser logouts
export async function GET() {
  return await POST();
} 