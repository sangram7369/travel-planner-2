import React, { useState, useEffect } from 'react';
import './ExpenseTracker.css';

const ExpenseTracker = ({ user }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Transportation',
    date: new Date().toISOString().split('T')[0]
  });
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  const categories = ['Transportation', 'Accommodation', 'Food', 'Entertainment', 'Shopping', 'Other'];

  useEffect(() => {
    fetchExpenses();
  }, [user]);

  const fetchExpenses = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/expenses/user/${user.userId}`);
      const data = await response.json();
      if (data.success) {
        setExpenses(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:8080/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: user.userId,
          amount: parseFloat(formData.amount)
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Expense added successfully!');
        setFormData({
          description: '',
          amount: '',
          category: 'Transportation',
          date: new Date().toISOString().split('T')[0]
        });
        fetchExpenses();
      } else {
        setError(data.message || 'Failed to add expense');
      }
    } catch (error) {
      setError('Network error. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const deleteExpense = async (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/expenses/${expenseId}`, {
          method: 'DELETE',
        });

        const data = await response.json();
        if (data.success) {
          setSuccess('Expense deleted successfully!');
          fetchExpenses();
        } else {
          setError('Failed to delete expense');
        }
      } catch (error) {
        setError('Network error occurred');
      }
    }
  };

  const filteredExpenses = filterCategory === 'All' 
    ? expenses 
    : expenses.filter(expense => expense.category === filterCategory);

  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const expensesByCategory = categories.reduce((acc, category) => {
    acc[category] = expenses
      .filter(expense => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0);
    return acc;
  }, {});

  return (
    <div className="expense-tracker">
      <div className="expense-header">
        <h1>💰 Expense Tracker</h1>
        <p>Keep track of your travel expenses and stay within budget</p>
      </div>

      <div className="expense-stats">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <div className="stat-number">${totalExpenses.toFixed(2)}</div>
              <div className="stat-label">Total Expenses</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-number">{filteredExpenses.length}</div>
              <div className="stat-label">Total Records</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <div className="stat-number">${filteredExpenses.length > 0 ? (totalExpenses / filteredExpenses.length).toFixed(2) : '0.00'}</div>
              <div className="stat-label">Average Expense</div>
            </div>
          </div>
        </div>
      </div>

      <div className="expense-content">
        <div className="expense-form-section">
          <div className="card">
            <h2>Add New Expense</h2>
            
            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleSubmit} className="expense-form">
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  className="form-control"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  placeholder="What did you spend on?"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="amount">Amount ($)</label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    className="form-control"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    name="category"
                    className="form-control"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  className="form-control"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-full"
                disabled={loading}
              >
                {loading ? 'Adding Expense...' : 'Add Expense'}
              </button>
            </form>
          </div>

          <div className="card">
            <h2>Expenses by Category</h2>
            <div className="category-breakdown">
              {categories.map(category => (
                <div key={category} className="category-item">
                  <div className="category-info">
                    <span className="category-name">{category}</span>
                    <span className="category-amount">${expensesByCategory[category].toFixed(2)}</span>
                  </div>
                  <div className="category-bar">
                    <div 
                      className="category-fill" 
                      style={{
                        width: `${totalExpenses > 0 ? (expensesByCategory[category] / totalExpenses) * 100 : 0}%`
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="expense-list-section">
          <div className="card">
            <div className="expense-list-header">
              <h2>Your Expenses</h2>
              <div className="filter-controls">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="form-control filter-select"
                >
                  <option value="All">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {filteredExpenses.length > 0 ? (
              <div className="expense-list">
                {filteredExpenses.map(expense => (
                  <div key={expense.expenseId} className="expense-item">
                    <div className="expense-main">
                      <div className="expense-info">
                        <h4>{expense.description}</h4>
                        <div className="expense-meta">
                          <span className="expense-category">{expense.category}</span>
                          <span className="expense-date">{new Date(expense.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="expense-amount">
                        ${expense.amount.toFixed(2)}
                      </div>
                    </div>
                    <div className="expense-actions">
                      <button
                        onClick={() => deleteExpense(expense.expenseId)}
                        className="btn btn-danger btn-small"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">💰</div>
                <h3>No expenses recorded yet</h3>
                <p>Start tracking your travel expenses!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTracker;
