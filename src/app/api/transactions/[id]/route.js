import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/mongodb';
import Transaction from '../../../../lib/models/Transaction';

// Force dynamic rendering - this prevents static generation errors
export const dynamic = 'force-dynamic';

// Mock transactions data (same as in main transactions route)
const transactions = [
  {
    _id: '1',
    title: 'Salary',
    amount: 3000,
    type: 'income',
    category: 'Salary',
    date: new Date('2025-04-01'),
    description: 'Monthly salary payment'
  },
  {
    _id: '2',
    title: 'Rent',
    amount: 1200,
    type: 'expense',
    category: 'Housing',
    date: new Date('2025-04-05'),
    description: 'Monthly rent payment'
  },
  {
    _id: '3',
    title: 'Groceries',
    amount: 150,
    type: 'expense',
    category: 'Food',
    date: new Date('2025-04-10'),
    description: 'Weekly grocery shopping'
  },
  {
    _id: '4',
    title: 'Freelance Work',
    amount: 500,
    type: 'income',
    category: 'Freelance',
    date: new Date('2025-04-15'),
    description: 'Website development project'
  }
];

export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    const id = params.id;
    
    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ transaction });
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transaction' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const id = params.id;
    const updatedData = await request.json();
    
    const transaction = await Transaction.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );
    
    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      message: 'Transaction updated successfully',
      transaction
    });
  } catch (error) {
    console.error('Error updating transaction:', error);
    return NextResponse.json(
      { error: 'Failed to update transaction' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();
    const id = params.id;
    
    const transaction = await Transaction.findByIdAndDelete(id);
    
    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      message: 'Transaction deleted successfully',
      id
    });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json(
      { error: 'Failed to delete transaction' },
      { status: 500 }
    );
  }
} 