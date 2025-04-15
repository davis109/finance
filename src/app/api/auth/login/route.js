import { NextResponse } from 'next/server';
import { loginUser } from '../../../../lib/auth';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const { usernameOrEmail, password } = await request.json();
    
    // Validate input
    if (!usernameOrEmail || !password) {
      return NextResponse.json(
        { error: 'Username/email and password are required' },
        { status: 400 }
      );
    }
    
    const { user, token } = await loginUser(usernameOrEmail, password);
    
    // Set cookie for authentication
    const cookieStore = cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });
    
    return NextResponse.json({ 
      success: true, 
      user,
      message: 'Login successful' 
    });
  } catch (error) {
    console.error('Login error:', error);
    
    if (error.message === 'Invalid credentials') {
      return NextResponse.json(
        { error: 'Invalid username/email or password' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
} 