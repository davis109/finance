import { NextResponse } from 'next/server';
import connectDB from '../../../utils/db';
import Transaction from '../../../models/Transaction';
import { Types } from 'mongoose';

export async function GET(request) {
  try {
    await connectDB();
    
    // Handle URL search params without using request.url directly
    const searchParams = request.nextUrl.searchParams;
    const month = parseInt(searchParams.get('month')) || new Date().getMonth() + 1;
    const year = parseInt(searchParams.get('year')) || new Date().getFullYear();
    
    // Define date range for the month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    
    // Get transactions for the month
    const transactions = await Transaction.find({
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ date: -1 });
    
    // Calculate statistics
    let totalIncome = 0;
    let totalExpense = 0;
    const categories = {};
    
    transactions.forEach(transaction => {
      if (transaction.type === 'income') {
        totalIncome += transaction.amount;
        
        // Track category
        if (!categories[transaction.category]) {
          categories[transaction.category] = { income: 0, expense: 0 };
        }
        categories[transaction.category].income += transaction.amount;
      } else {
        totalExpense += transaction.amount;
        
        // Track category
        if (!categories[transaction.category]) {
          categories[transaction.category] = { income: 0, expense: 0 };
        }
        categories[transaction.category].expense += transaction.amount;
      }
    });
    
    // Format statistics
    const statistics = {
      summary: {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
        transactionCount: transactions.length
      },
      categories,
      recentTransactions: transactions.slice(0, 5) // Get last 5 transactions
    };
    
    return NextResponse.json(statistics);
  } catch (error) {
    console.error('Error in statistics API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
} 