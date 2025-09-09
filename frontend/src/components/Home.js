import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Plan Your Perfect Journey
          </h1>
          <p className="hero-subtitle">
            Discover amazing destinations, book flights, hotels, and create unforgettable travel experiences
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary btn-large">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-outline btn-large">
              Sign In
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="floating-card">
            <h3>✈️ Book Flights</h3>
            <p>Find the best deals on flights worldwide</p>
          </div>
          <div className="floating-card">
            <h3>🏨 Hotels</h3>
            <p>Comfortable stays at great prices</p>
          </div>
          <div className="floating-card">
            <h3>🚂 Transportation</h3>
            <p>Trains, buses, and more</p>
          </div>
        </div>
      </div>

      <div className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose Travel Planner?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🗺️</div>
              <h3>Smart Trip Planning</h3>
              <p>Create detailed itineraries with our intelligent planning tools</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Best Price Guarantee</h3>
              <p>Compare prices across multiple providers to get the best deals</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Mobile Friendly</h3>
              <p>Access your travel plans anywhere, anytime on any device</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure Booking</h3>
              <p>Your personal and payment information is always protected</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Expense Tracking</h3>
              <p>Keep track of your travel expenses and stay within budget</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Personalized Recommendations</h3>
              <p>Get suggestions tailored to your preferences and travel style</p>
            </div>
          </div>
        </div>
      </div>

      <div className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Happy Travelers</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Destinations</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Bookings Made</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">4.9★</div>
              <div className="stat-label">User Rating</div>
            </div>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <div className="container">
          <h2>Ready to Start Your Adventure?</h2>
          <p>Join thousands of travelers who trust us with their journeys</p>
          <Link to="/register" className="btn btn-primary btn-large">
            Start Planning Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
