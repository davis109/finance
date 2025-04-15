import { NextResponse } from 'next/server';
import connectDB from '../../../../utils/db';
import Transaction from '../../../../models/Transaction';

export async function GET(request) {
  try {
    await connectDB();
    
    // Get date range from params
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')) : null;
    const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')) : null;
    
    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Start date and end date are required' },
        { status: 400 }
      );
    }
    
    // Aggregate transactions by month
    const transactions = await Transaction.find({
      date: {
        $gte: startDate,
        $lte: endDate
      }
    });
    
    // Group transactions by month and year
    const monthlyData = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const key = `${year}-${month}`;
      
      if (!monthlyData[key]) {
        monthlyData[key] = {
          month,
          year,
          income: 0,
          expenses: 0,
          netIncome: 0
        };
      }
      
      if (transaction.type === 'income') {
        monthlyData[key].income += transaction.amount;
      } else {
        monthlyData[key].expenses += transaction.amount;
      }
      
      // Update net income
      monthlyData[key].netIncome = monthlyData[key].income - monthlyData[key].expenses;
    });
    
    // Convert to array and sort by date
    const months = Object.values(monthlyData).sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    });
    
    return NextResponse.json({ months });
  } catch (error) {
    console.error('Error in monthly statistics API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch monthly statistics' },
      { status: 500 }
    );
  }
} 