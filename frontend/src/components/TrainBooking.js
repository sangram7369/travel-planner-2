import React, { useState, useEffect } from 'react';
import './Booking.css';

const TrainBooking = ({ user }) => {
  const [searchData, setSearchData] = useState({
    origin: '',
    destination: '',
    departureDate: '',
    passengers: 1,
    class: 'Economy'
  });
  const [trains, setTrains] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/trains/bookings/user/${user.userId}`);
      const data = await response.json();
      if (data.success) {
        setBookings(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value
    });
  };

  const searchTrains = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/trains/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchData),
      });

      const data = await response.json();
      if (data.success) {
        setTrains(data.data || []);
      } else {
        setError(data.message || 'Failed to search trains');
      }
    } catch (error) {
      setError('Network error. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const bookTrain = async (train) => {
    try {
      const response = await fetch('http://localhost:8080/api/trains/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.userId,
          trainId: train.trainId,
          passengers: searchData.passengers,
          seatClass: searchData.class,
          totalPrice: train.price * searchData.passengers
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSuccess('Train booked successfully!');
        fetchBookings();
      } else {
        setError(data.message || 'Failed to book train');
      }
    } catch (error) {
      setError('Network error occurred');
    }
  };

  return (
    <div className="booking-page train-booking">
      <div className="booking-header">
        <h1>🚂 Train Booking</h1>
        <p>Book comfortable train journeys across the country</p>
      </div>

      <div className="booking-content">
        <div className="search-section">
          <div className="card">
            <h2>Search Trains</h2>
            
            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={searchTrains} className="search-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="origin">From Station</label>
                  <input
                    type="text"
                    id="origin"
                    name="origin"
                    className="form-control"
                    value={searchData.origin}
                    onChange={handleSearchChange}
                    required
                    placeholder="Origin station"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="destination">To Station</label>
                  <input
                    type="text"
                    id="destination"
                    name="destination"
                    className="form-control"
                    value={searchData.destination}
                    onChange={handleSearchChange}
                    required
                    placeholder="Destination station"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="departureDate">Travel Date</label>
                  <input
                    type="date"
                    id="departureDate"
                    name="departureDate"
                    className="form-control"
                    value={searchData.departureDate}
                    onChange={handleSearchChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="class">Class</label>
                  <select
                    id="class"
                    name="class"
                    className="form-control"
                    value={searchData.class}
                    onChange={handleSearchChange}
                  >
                    <option value="Economy">Economy</option>
                    <option value="Business">Business</option>
                    <option value="First">First Class</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="passengers">Passengers</label>
                <select
                  id="passengers"
                  name="passengers"
                  className="form-control"
                  value={searchData.passengers}
                  onChange={handleSearchChange}
                >
                  {[1,2,3,4,5,6].map(num => (
                    <option key={num} value={num}>{num} Passenger{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-full"
                disabled={loading}
              >
                {loading ? 'Searching...' : 'Search Trains'}
              </button>
            </form>
          </div>
        </div>

        <div className="results-section">
          {trains.length > 0 && (
            <div className="card">
              <h2>Available Trains</h2>
              <div className="results-list">
                {trains.map(train => (
                  <div key={train.trainId} className="result-item">
                    <div className="result-header">
                      <h3>{train.trainName}</h3>
                      <div className="price">${train.price}</div>
                    </div>
                    
                    <div className="result-details">
                      <div className="route">
                        <span className="route-info">
                          {train.origin} → {train.destination}
                        </span>
                        <span className="flight-number">Train {train.trainNumber}</span>
                      </div>
                      
                      <div className="times">
                        <span>Departure: {new Date(train.departureTime).toLocaleString()}</span>
                        <span>Arrival: {new Date(train.arrivalTime).toLocaleString()}</span>
                      </div>
                      
                      <div className="duration">
                        Duration: {train.duration}
                      </div>
                    </div>
                    
                    <div className="result-actions">
                      <button
                        onClick={() => bookTrain(train)}
                        className="btn btn-success"
                      >
                        Book Train
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="card">
            <h2>Your Train Bookings</h2>
            {bookings.length > 0 ? (
              <div className="bookings-list">
                {bookings.map(booking => (
                  <div key={booking.bookingId} className="booking-item">
                    <div className="booking-header">
                      <h3>{booking.train.trainName}</h3>
                      <span className="booking-status confirmed">Confirmed</span>
                    </div>
                    
                    <div className="booking-details">
                      <div className="booking-route">
                        {booking.train.origin} → {booking.train.destination}
                      </div>
                      <div className="booking-info">
                        <span>Train: {booking.train.trainNumber}</span>
                        <span>Class: {booking.seatClass}</span>
                        <span>Passengers: {booking.passengers}</span>
                        <span>Total: ${booking.totalPrice}</span>
                      </div>
                      <div className="booking-dates">
                        Departure: {new Date(booking.train.departureTime).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🚂</div>
                <h3>No train bookings yet</h3>
                <p>Search and book your first train journey!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainBooking;
