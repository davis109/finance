'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

export default function BudgetDetail({ budget, transactions, onClose }) {
  const [transactionsByDay, setTransactionsByDay] = useState([]);
  const detailRef = useRef(null);
  
  // GSAP animation for component entry
  useEffect(() => {
    if (detailRef.current) {
      gsap.fromTo(
        detailRef.current,
        { 
          opacity: 0,
          y: 20,
          scale: 0.98
        },
        { 
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.4,
          ease: 'power2.out'
        }
      );
    }
    
    // Group transactions by day
    if (transactions && transactions.length > 0) {
      const byDay = {};
      
      transactions.forEach(transaction => {
        if (transaction.category === budget.category) {
          const date = new Date(transaction.date);
          const day = date.getDate();
          
          if (!byDay[day]) {
            byDay[day] = {
              day,
              total: 0,
              count: 0,
              transactions: []
            };
          }
          
          byDay[day].total += Math.abs(transaction.amount);
          byDay[day].count += 1;
          byDay[day].transactions.push(transaction);
        }
      });
      
      // Convert to array and sort by day
      const byDayArray = Object.values(byDay).sort((a, b) => a.day - b.day);
      setTransactionsByDay(byDayArray);
    }
  }, [budget, transactions]);
  
  // Function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  // Calculate percentage spent
  const percentSpent = budget.allocated > 0 
    ? (Math.abs(budget.spent) / budget.allocated) * 100 
    : 0;
  
  // Calculate remaining amount
  const remaining = budget.allocated - Math.abs(budget.spent);
  
  // Prepare data for pie chart
  const pieData = [
    { name: 'Spent', value: Math.abs(budget.spent) },
    { name: 'Remaining', value: remaining > 0 ? remaining : 0 }
  ];
  
  // Colors for pie chart
  const COLORS = ['#ff6b6b', '#51cf66'];
  
  // Handle close animation
  const handleClose = () => {
    if (detailRef.current) {
      gsap.to(detailRef.current, {
        opacity: 0,
        y: 20,
        scale: 0.98,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: onClose
      });
    } else {
      onClose();
    }
  };
  
  return (
    <div 
      ref={detailRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={handleClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {budget.category} Budget Detail
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Budget Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Allocated:</span>
                  <span className="font-bold">{formatCurrency(budget.allocated)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Spent:</span>
                  <span className="font-bold text-red-500">{formatCurrency(Math.abs(budget.spent))}</span>
                </div>
                <div className="flex justify-between">
                  <span>Remaining:</span>
                  <span className={`font-bold ${remaining > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {formatCurrency(remaining)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Percent Used:</span>
                  <span className={`font-bold ${percentSpent > 90 ? 'text-red-500' : percentSpent > 75 ? 'text-yellow-500' : 'text-green-500'}`}>
                    {percentSpent.toFixed(1)}%
                  </span>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Daily Spending</h3>
              {transactionsByDay.length > 0 ? (
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={transactionsByDay}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" label={{ value: 'Day of Month', position: 'insideBottom', offset: -5 }} />
                      <YAxis tickFormatter={(value) => `$${value}`} />
                      <Tooltip 
                        formatter={(value) => formatCurrency(value)}
                        labelFormatter={(label) => `Day ${label}`}
                      />
                      <Bar dataKey="total" fill="#8884d8" name="Amount Spent" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No transactions for this budget category.</p>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Transactions</h3>
            {transactions && transactions.filter(t => t.category === budget.category).length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                    {transactions
                      .filter(t => t.category === budget.category)
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .map(transaction => (
                        <tr key={transaction._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {new Date(transaction.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{transaction.description}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600 dark:text-red-400">
                            {formatCurrency(Math.abs(transaction.amount))}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No transactions for this budget category.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 