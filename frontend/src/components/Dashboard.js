import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = ({ user }) => {
  const [stats, setStats] = useState({
    totalTrips: 0,
    upcomingTrips: 0,
    totalExpenses: 0,
    recentBookings: 0
  });
  const [recentTrips, setRecentTrips] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch user trips
      const tripsResponse = await fetch(`http://localhost:8080/api/trips/user/${user.userId}`);
      const tripsData = await tripsResponse.json();
      
      // Fetch user expenses
      const expensesResponse = await fetch(`http://localhost:8080/api/expenses/user/${user.userId}`);
      const expensesData = await expensesResponse.json();

      if (tripsData.success) {
        const trips = tripsData.data || [];
        const upcomingTrips = trips.filter(trip => new Date(trip.startDate) > new Date()).length;
        setRecentTrips(trips.slice(0, 3));
        setStats(prev => ({
          ...prev,
          totalTrips: trips.length,
          upcomingTrips: upcomingTrips
        }));
      }

      if (expensesData.success) {
        const expenses = expensesData.data || [];
        const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        setRecentExpenses(expenses.slice(0, 3));
        setStats(prev => ({
          ...prev,
          totalExpenses: totalExpenses,
          recentBookings: expenses.length
        }));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user.name}! 👋</h1>
        <p>Here's what's happening with your travel plans</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🗺️</div>
          <div className="stat-content">
            <div className="stat-number">{stats.totalTrips}</div>
            <div className="stat-label">Total Trips</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✈️</div>
          <div className="stat-content">
            <div className="stat-number">{stats.upcomingTrips}</div>
            <div className="stat-label">Upcoming Trips</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-number">${stats.totalExpenses.toFixed(2)}</div>
            <div className="stat-label">Total Expenses</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <div className="stat-number">{stats.recentBookings}</div>
            <div className="stat-label">Recent Bookings</div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Quick Actions</h2>
          </div>
          <div className="quick-actions">
            <Link to="/plan-trip" className="action-card">
              <div className="action-icon">🗺️</div>
              <h3>Plan New Trip</h3>
              <p>Create a new travel itinerary</p>
            </Link>
            <Link to="/flights" className="action-card">
              <div className="action-icon">✈️</div>
              <h3>Book Flight</h3>
              <p>Find and book flights</p>
            </Link>
            <Link to="/hotels" className="action-card">
              <div className="action-icon">🏨</div>
              <h3>Book Hotel</h3>
              <p>Find accommodation</p>
            </Link>
            <Link to="/expenses" className="action-card">
              <div className="action-icon">💰</div>
              <h3>Track Expenses</h3>
              <p>Manage your travel budget</p>
            </Link>
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Trips</h2>
            <Link to="/plan-trip" className="btn btn-outline">View All</Link>
          </div>
          <div className="recent-items">
            {recentTrips.length > 0 ? (
              recentTrips.map(trip => (
                <div key={trip.tripId} className="recent-item">
                  <div className="item-icon">🗺️</div>
                  <div className="item-content">
                    <h4>{trip.destination}</h4>
                    <p>{new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</p>
                    <span className={`badge ${new Date(trip.startDate) > new Date() ? 'badge-info' : 'badge-success'}`}>
                      {new Date(trip.startDate) > new Date() ? 'Upcoming' : 'Completed'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>No trips yet. <Link to="/plan-trip">Plan your first trip!</Link></p>
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Expenses</h2>
            <Link to="/expenses" className="btn btn-outline">View All</Link>
          </div>
          <div className="recent-items">
            {recentExpenses.length > 0 ? (
              recentExpenses.map(expense => (
                <div key={expense.expenseId} className="recent-item">
                  <div className="item-icon">💰</div>
                  <div className="item-content">
                    <h4>{expense.description}</h4>
                    <p>{expense.category} • {new Date(expense.date).toLocaleDateString()}</p>
                    <span className="expense-amount">${expense.amount.toFixed(2)}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>No expenses tracked yet. <Link to="/expenses">Start tracking!</Link></p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
