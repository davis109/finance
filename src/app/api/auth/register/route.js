import { NextResponse } from 'next/server';
import { registerUser } from '../../../../lib/auth';

export async function POST(request) {
  try {
    const { username, email, password } = await request.json();
    
    // Validate input
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Username, email, and password are required' },
        { status: 400 }
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }
    
    const user = await registerUser(username, email, password);
    
    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle specific error messages
    if (error.message.includes('already exists')) {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
} 