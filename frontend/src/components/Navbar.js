import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          ✈️ Travel Planner
        </Link>
        
        <div className="nav-menu">
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/plan-trip" className="nav-link">Plan Trip</Link>
              <div className="nav-dropdown">
                <span className="nav-link dropdown-toggle">Bookings</span>
                <div className="dropdown-menu">
                  <Link to="/flights" className="dropdown-item">Flights</Link>
                  <Link to="/trains" className="dropdown-item">Trains</Link>
                  <Link to="/buses" className="dropdown-item">Buses</Link>
                  <Link to="/hotels" className="dropdown-item">Hotels</Link>
                </div>
              </div>
              <Link to="/expenses" className="nav-link">Expenses</Link>
              <div className="nav-dropdown">
                <span className="nav-link dropdown-toggle">👤 {user.name}</span>
                <div className="dropdown-menu">
                  <Link to="/profile" className="dropdown-item">Profile</Link>
                  <button onClick={handleLogout} className="dropdown-item logout-btn">
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link btn-register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
