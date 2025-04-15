import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/finance-app';
const JWT_SECRET = process.env.JWT_SECRET || 'finance-app-secret-key';

// User collection name
const USER_COLLECTION = 'users';

// Connect to MongoDB
async function connectToDatabase() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    return client.db();
  } catch (error) {
    console.error('Failed to connect to the database', error);
    throw new Error('Database connection failed');
  }
}

// Register a new user
export async function registerUser(username, email, password) {
  const db = await connectToDatabase();
  const collection = db.collection(USER_COLLECTION);
  
  // Check if user already exists
  const existingUser = await collection.findOne({ 
    $or: [{ username }, { email }] 
  });
  
  if (existingUser) {
    if (existingUser.username === username) {
      throw new Error('Username already exists');
    }
    if (existingUser.email === email) {
      throw new Error('Email already exists');
    }
  }
  
  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  
  // Create user
  const user = {
    username,
    email,
    password: hashedPassword,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  await collection.insertOne(user);
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

// Login user
export async function loginUser(usernameOrEmail, password) {
  const db = await connectToDatabase();
  const collection = db.collection(USER_COLLECTION);
  
  // Find user
  const user = await collection.findOne({ 
    $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }] 
  });
  
  if (!user) {
    throw new Error('Invalid credentials');
  }
  
  // Compare password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }
  
  // Create token
  const token = jwt.sign(
    { id: user._id, username: user.username, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  // Return user and token
  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
}

// Verify token
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
}

// Get user by ID
export async function getUserById(userId) {
  const db = await connectToDatabase();
  const collection = db.collection(USER_COLLECTION);
  
  const user = await collection.findOne({ _id: userId });
  
  if (!user) {
    throw new Error('User not found');
  }
  
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
} 