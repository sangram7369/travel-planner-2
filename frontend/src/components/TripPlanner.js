import React, { useState, useEffect } from 'react';
import './TripPlanner.css';

const TripPlanner = ({ user }) => {
  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
    description: ''
  });
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchTrips();
  }, [user]);

  const fetchTrips = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/trips/user/${user.userId}`);
      const data = await response.json();
      if (data.success) {
        setTrips(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching trips:', error);
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
      const response = await fetch('http://localhost:8080/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: user.userId
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Trip planned successfully!');
        setFormData({
          destination: '',
          startDate: '',
          endDate: '',
          budget: '',
          description: ''
        });
        fetchTrips();
      } else {
        setError(data.message || 'Failed to create trip');
      }
    } catch (error) {
      setError('Network error. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const deleteTrip = async (tripId) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/trips/${tripId}`, {
          method: 'DELETE',
        });

        const data = await response.json();
        if (data.success) {
          setSuccess('Trip deleted successfully!');
          fetchTrips();
        } else {
          setError('Failed to delete trip');
        }
      } catch (error) {
        setError('Network error occurred');
      }
    }
  };

  return (
    <div className="trip-planner">
      <div className="trip-planner-header">
        <h1>Plan Your Trip</h1>
        <p>Create amazing travel experiences</p>
      </div>

      <div className="trip-planner-content">
        <div className="trip-form-section">
          <div className="card">
            <h2>Create New Trip</h2>
            
            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleSubmit} className="trip-form">
              <div className="form-group">
                <label htmlFor="destination">Destination</label>
                <input
                  type="text"
                  id="destination"
                  name="destination"
                  className="form-control"
                  value={formData.destination}
                  onChange={handleChange}
                  required
                  placeholder="Where do you want to go?"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="startDate">Start Date</label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    className="form-control"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="endDate">End Date</label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    className="form-control"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="budget">Budget ($)</label>
                <input
                  type="number"
                  id="budget"
                  name="budget"
                  className="form-control"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="Enter your budget"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  className="form-control"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Describe your trip plans..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-full"
                disabled={loading}
              >
                {loading ? 'Creating Trip...' : 'Create Trip'}
              </button>
            </form>
          </div>
        </div>

        <div className="trips-list-section">
          <div className="card">
            <h2>Your Trips</h2>
            
            {trips.length > 0 ? (
              <div className="trips-list">
                {trips.map(trip => (
                  <div key={trip.tripId} className="trip-item">
                    <div className="trip-header">
                      <h3>{trip.destination}</h3>
                      <span className={`trip-status ${new Date(trip.startDate) > new Date() ? 'upcoming' : 'completed'}`}>
                        {new Date(trip.startDate) > new Date() ? 'Upcoming' : 'Completed'}
                      </span>
                    </div>
                    
                    <div className="trip-details">
                      <div className="trip-dates">
                        <span className="date-label">📅</span>
                        {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                      </div>
                      
                      {trip.budget && (
                        <div className="trip-budget">
                          <span className="budget-label">💰</span>
                          ${parseFloat(trip.budget).toFixed(2)}
                        </div>
                      )}
                      
                      {trip.description && (
                        <div className="trip-description">
                          <p>{trip.description}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="trip-actions">
                      <button
                        onClick={() => deleteTrip(trip.tripId)}
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
                <div className="empty-icon">🗺️</div>
                <h3>No trips planned yet</h3>
                <p>Create your first trip to get started!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripPlanner;
