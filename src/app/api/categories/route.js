import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import Category from '../../../lib/models/Category';

// Force dynamic rendering - this prevents static generation errors
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Mock categories data
    const categories = [
      {
        _id: '1',
        name: 'Food',
        type: 'expense',
        icon: '🍔',
        color: '#e74c3c'
      },
      {
        _id: '2',
        name: 'Housing',
        type: 'expense',
        icon: '🏠',
        color: '#3498db'
      },
      {
        _id: '3',
        name: 'Transportation',
        type: 'expense',
        icon: '🚗',
        color: '#f39c12'
      },
      {
        _id: '4',
        name: 'Utilities',
        type: 'expense',
        icon: '💡',
        color: '#9b59b6'
      },
      {
        _id: '5',
        name: 'Entertainment',
        type: 'expense',
        icon: '🎬',
        color: '#1abc9c'
      },
      {
        _id: '6',
        name: 'Salary',
        type: 'income',
        icon: '💼',
        color: '#2ecc71'
      },
      {
        _id: '7',
        name: 'Freelance',
        type: 'income',
        icon: '💻',
        color: '#27ae60'
      },
      {
        _id: '8',
        name: 'Investments',
        type: 'income',
        icon: '📈',
        color: '#16a085'
      }
    ];

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' }, 
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const category = await request.json();
    
    // In a real app, you would save to database here
    
    return NextResponse.json({
      message: 'Category created successfully',
      category: {
        ...category,
        _id: Date.now().toString() // Generate mock ID
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
} 