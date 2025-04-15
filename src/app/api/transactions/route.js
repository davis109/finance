import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import mongoose from 'mongoose';
import Transaction from '../../../lib/models/Transaction';

// Force dynamic rendering - this prevents static generation errors
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    
    // Get query parameters for filtering
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;
    
    const category = searchParams.get('category');
    const type = searchParams.get('type');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const month = searchParams.get('month');
    const year = searchParams.get('year');
    
    // Build filter query
    const filter = {};
    
    if (category) {
      filter.category = category;
    }
    
    if (type) {
      filter.type = type;
    }
    
    // Handle date filtering
    if (startDate || endDate) {
      filter.date = {};
      
      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }
      
      if (endDate) {
        filter.date.$lte = new Date(endDate);
      }
    } else if (month && year) {
      // Filter by specific month and year
      const startOfMonth = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endOfMonth = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59, 999);
      
      filter.date = {
        $gte: startOfMonth,
        $lte: endOfMonth
      };
    }
    
    // Fetch transactions with pagination
    const transactions = await Transaction.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const total = await Transaction.countDocuments(filter);
    
    return NextResponse.json({
      transactions,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    
    const data = await request.json();
    
    if (!data.amount || !data.description || !data.category || !data.type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // If a date string is provided, parse it, otherwise use current date
    if (data.date) {
      data.date = new Date(data.date);
    }
    
    const transaction = new Transaction(data);
    await transaction.save();
    
    return NextResponse.json({ success: true, transaction }, { status: 201 });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
} 