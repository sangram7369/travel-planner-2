import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import TripPlanner from './components/TripPlanner';
import FlightBooking from './components/FlightBooking';
import TrainBooking from './components/TrainBooking';
import BusBooking from './components/BusBooking';
import HotelBooking from './components/HotelBooking';
import ExpenseTracker from './components/ExpenseTracker';
import Profile from './components/Profile';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Navbar user={user} onLogout={handleLogout} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/login" 
              element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} 
            />
            <Route 
              path="/register" 
              element={user ? <Navigate to="/dashboard" /> : <Register onLogin={handleLogin} />} 
            />
            <Route 
              path="/dashboard" 
              element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/plan-trip" 
              element={user ? <TripPlanner user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/flights" 
              element={user ? <FlightBooking user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/trains" 
              element={user ? <TrainBooking user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/buses" 
              element={user ? <BusBooking user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/hotels" 
              element={user ? <HotelBooking user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/expenses" 
              element={user ? <ExpenseTracker user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/profile" 
              element={user ? <Profile user={user} /> : <Navigate to="/login" />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
