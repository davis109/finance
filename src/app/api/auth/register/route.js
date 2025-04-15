import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/mongodb';
import mongoose from 'mongoose';

// User schema model
let User;
try {
  User = mongoose.model('User');
} catch {
  const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  User = mongoose.model('User', userSchema);
}

// Force dynamic rendering - this prevents static generation errors
export const dynamic = 'force-dynamic';

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
    
    await connectToDatabase();
    
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { username: username },
        { email: email }
      ]
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'Username or email already exists' },
        { status: 409 }
      );
    }
    
    // Create new user
    const newUser = new User({
      username,
      email,
      password, // Note: In a real app, you should hash the password
    });
    
    await newUser.save();
    
    // Remove password from response
    const userResponse = {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      createdAt: newUser.createdAt
    };
    
    return NextResponse.json(
      { success: true, user: userResponse },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
} 