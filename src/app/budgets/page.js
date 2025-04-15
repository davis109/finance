'use client';

import { useState, useEffect, useRef } from 'react';
import Layout from '../../components/Layout';
import BudgetDetail from '../../components/BudgetDetail';
import { gsap } from 'gsap';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Budgets() {
  const [loading, setLoading] = useState(true);
  const [budgetsLoading, setBudgetsLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState(null);
  
  // Month and year selection
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  // Form state
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    month: selectedMonth,
    year: selectedYear
  });
  
  // Animation refs
  const formRef = useRef(null);
  const chartRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef(null);
  
  // Fetch budgets for the selected month and year
  useEffect(() => {
    async function fetchBudgets() {
      try {
        setBudgetsLoading(true);
        
        const response = await fetch(`/api/budgets?month=${selectedMonth}&year=${selectedYear}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch budgets');
        }
        
        const data = await response.json();
        setBudgets(data.budgets || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching budgets:', err);
        setError('Failed to load budgets. Please try again.');
      } finally {
        setBudgetsLoading(false);
        setLoading(false);
      }
    }
    
    fetchBudgets();
    
    // Update form data when selected month/year changes
    setFormData(prev => ({
      ...prev,
      month: selectedMonth,
      year: selectedYear
    }));
  }, [selectedMonth, selectedYear]);
  
  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/categories');
        
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        
        const data = await response.json();
        
        // Filter out income categories
        const expenseCategories = data.categories.filter(cat => 
          cat.type === 'expense' || cat.type === 'both'
        );
        
        setCategories(expenseCategories);
        
        // Initialize form with first category if empty
        if (expenseCategories.length > 0 && !formData.category) {
          setFormData(prev => ({
            ...prev,
            category: expenseCategories[0].name
          }));
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Please try again.');
      }
    }
    
    fetchCategories();
  }, []);
  
  // Fetch statistics for comparison
  useEffect(() => {
    async function fetchStatistics() {
      try {
        setStatsLoading(true);
        const response = await fetch(`/api/statistics?month=${selectedMonth}&year=${selectedYear}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch statistics');
        }
        
        const data = await response.json();
        setStatistics(data || {});
      } catch (err) {
        console.error('Error fetching statistics:', err);
        // Non-blocking error, we can still show budgets without stats
      } finally {
        setStatsLoading(false);
      }
    }
    
    fetchStatistics();
  }, [selectedMonth, selectedYear]);
  
  // Fetch transactions for the selected month and year
  useEffect(() => {
    async function fetchTransactions() {
      try {
        const response = await fetch(`/api/transactions?month=${selectedMonth}&year=${selectedYear}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch transactions');
        }
        
        const data = await response.json();
        setTransactions(data.transactions || []);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        // Non-blocking error
      }
    }
    
    fetchTransactions();
  }, [selectedMonth, selectedYear]);
  
  // GSAP animations - only run when data is loaded and components are mounted
  useEffect(() => {
    const shouldAnimate = !loading && !budgetsLoading && !statsLoading;
    
    if (shouldAnimate) {
      // Animate title
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { y: -30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }
        );
      }
      
      if (formRef.current) {
        gsap.fromTo(
          formRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', delay: 0.2 }
        );
      }
      
      if (chartRef.current) {
        gsap.fromTo(
          chartRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', delay: 0.4 }
        );
      }
      
      if (cardsRef.current && cardsRef.current.children.length > 0) {
        gsap.fromTo(
          cardsRef.current.children,
          { y: 30, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            stagger: 0.1, 
            duration: 0.4, 
            ease: 'power2.out',
            delay: 0.6 
          }
        );
      }
    }
  }, [loading, budgetsLoading, statsLoading, budgets.length]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'amount' ? value : value
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.category || !formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Please provide a valid category and amount');
      return;
    }
    
    try {
      setBudgetsLoading(true);
      
      const response = await fetch('/api/budgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount)
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to save budget');
      }
      
      // Refresh budgets
      const budgetsResponse = await fetch(`/api/budgets?month=${selectedMonth}&year=${selectedYear}`);
      const budgetsData = await budgetsResponse.json();
      setBudgets(budgetsData.budgets || []);
      
      // Reset form
      setFormData({
        ...formData,
        amount: ''
      });
      
      setError(null);
    } catch (err) {
      console.error('Error saving budget:', err);
      setError('Failed to save budget. Please try again.');
    } finally {
      setBudgetsLoading(false);
    }
  };
  
  // Chart data preparation
  const getChartData = () => {
    if (!budgets || !statistics) return [];
    
    return budgets.map(budget => {
      const category = budget.category;
      const actualData = statistics.categories && statistics.categories[category] 
        ? statistics.categories[category].expense || 0 
        : 0;
      
      const remaining = Math.max(0, budget.amount - actualData);
      const overspent = actualData > budget.amount ? actualData - budget.amount : 0;
      
      return {
        category,
        budget: budget.amount,
        actual: actualData,
        remaining,
        overspent
      };
    });
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  // Budget status calculation
  const calculateBudgetStatus = (budget) => {
    if (!statistics || !statistics.categories) return { status: 'neutral', percentage: 0 };
    
    const category = budget.category;
    const actualData = statistics.categories && statistics.categories[category] 
      ? statistics.categories[category].expense || 0 
      : 0;
    
    const percentage = budget.amount > 0 ? Math.round((actualData / budget.amount) * 100) : 0;
    
    if (percentage >= 100) {
      return { 
        status: 'danger', 
        percentage: 100, 
        message: `Overspent by ${formatCurrency(actualData - budget.amount)}` 
      };
    } else if (percentage >= 75) {
      return { 
        status: 'warning', 
        percentage, 
        message: `${formatCurrency(budget.amount - actualData)} remaining` 
      };
    } else {
      return { 
        status: 'success', 
        percentage, 
        message: `${formatCurrency(budget.amount - actualData)} remaining` 
      };
    }
  };
  
  // Handle viewing budget details
  const handleViewBudgetDetail = (budget) => {
    setSelectedBudget(budget);
  };
  
  // Handle closing budget detail modal
  const handleCloseBudgetDetail = () => {
    setSelectedBudget(null);
  };
  
  // Determine if chart data is ready to display
  const chartData = getChartData();
  const isChartReady = !budgetsLoading && !statsLoading && budgets.length > 0;
  const showLoader = loading || (budgetsLoading && !budgets.length);
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 ref={titleRef} className="text-3xl font-bold mb-6 text-center">
          Budget Management
        </h1>
        
        {/* Month and year selection */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
          <div className="flex flex-wrap justify-center gap-4">
            <div className="w-full sm:w-auto">
              <label className="block text-sm font-medium mb-1">Month</label>
              <select 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="w-full p-2 border rounded-md"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={`month-${i+1}`} value={i+1}>
                    {new Date(0, i).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full sm:w-auto">
              <label className="block text-sm font-medium mb-1">Year</label>
              <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="w-full p-2 border rounded-md"
              >
                {Array.from({ length: 5 }, (_, i) => (
                  <option key={`year-${new Date().getFullYear() - i}`} value={new Date().getFullYear() - i}>
                    {new Date().getFullYear() - i}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>{error}</p>
          </div>
        )}
        
        {/* Create Budget Form */}
        <div ref={formRef} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Create New Budget</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select 
                  name="category" 
                  value={formData.category} 
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category._id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Budget Amount</label>
                <input 
                  type="number" 
                  name="amount" 
                  value={formData.amount} 
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  min="0"
                  step="0.01"
                  required
                  placeholder="0.00"
                />
              </div>
              <div className="flex items-end">
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  disabled={budgetsLoading}
                >
                  {budgetsLoading ? 'Saving...' : 'Save Budget'}
                </button>
              </div>
            </div>
          </form>
        </div>
        
        {/* Budget Comparison Chart */}
        {!loading && (
          <div ref={chartRef} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Budget vs Actual Spending</h2>
            {budgets.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={getChartData()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="category" 
                      angle={-45} 
                      textAnchor="end"
                      height={70}
                      interval={0}
                    />
                    <YAxis tickFormatter={(value) => `$${value}`} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                    <Bar dataKey="budget" name="Budgeted" fill="#4299e1" />
                    <Bar dataKey="actual" name="Actual" fill="#f56565" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No budgets created for this month. Create your first budget above.
              </p>
            )}
          </div>
        )}
        
        {/* Budget Status Cards */}
        {!loading && (
          <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {budgets.map(budget => {
              const status = calculateBudgetStatus(budget);
              const remainingAmount = budget.allocated - Math.abs(budget.spent);
              
              return (
                <div 
                  key={budget._id} 
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleViewBudgetDetail(budget)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold">{budget.category}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      status === 'danger' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                      status === 'warning' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}>
                      {status === 'danger' ? 'Overspent' : 
                       status === 'warning' ? 'Close to limit' : 'On track'}
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Budget</span>
                      <span className="font-semibold">{formatCurrency(budget.allocated)}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Spent</span>
                      <span className="font-semibold text-red-500 dark:text-red-400">
                        {formatCurrency(Math.abs(budget.spent))}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Remaining</span>
                      <span className={`font-semibold ${
                        remainingAmount < 0 ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400'
                      }`}>
                        {formatCurrency(remainingAmount)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        status === 'danger' ? 'bg-red-500' :
                        status === 'warning' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ 
                        width: `${Math.min(
                          Math.abs(budget.spent) / budget.allocated * 100, 
                          100
                        )}%` 
                      }}
                    ></div>
                  </div>
                  
                  <div className="text-center mt-4">
                    <button 
                      className="text-sm text-blue-500 hover:text-blue-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewBudgetDetail(budget);
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {loading && (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {/* Budget Detail Modal */}
        {selectedBudget && (
          <BudgetDetail 
            budget={selectedBudget} 
            transactions={transactions}
            onClose={handleCloseBudgetDetail}
          />
        )}
      </div>
    </Layout>
  );
} 