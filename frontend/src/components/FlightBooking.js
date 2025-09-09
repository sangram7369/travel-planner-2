import React, { useState, useEffect } from 'react';
import './Booking.css';

const FlightBooking = ({ user }) => {
  const [searchData, setSearchData] = useState({
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    passengers: 1
  });
  const [flights, setFlights] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/flights/bookings/user/${user.userId}`);
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

  const searchFlights = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/flights/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchData),
      });

      const data = await response.json();
      if (data.success) {
        setFlights(data.data || []);
      } else {
        setError(data.message || 'Failed to search flights');
      }
    } catch (error) {
      setError('Network error. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const bookFlight = async (flight) => {
    try {
      const response = await fetch('http://localhost:8080/api/flights/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.userId,
          flightId: flight.flightId,
          passengers: searchData.passengers,
          totalPrice: flight.price * searchData.passengers
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSuccess('Flight booked successfully!');
        fetchBookings();
      } else {
        setError(data.message || 'Failed to book flight');
      }
    } catch (error) {
      setError('Network error occurred');
    }
  };

  return (
    <div className="booking-page">
      <div className="booking-header">
        <h1>✈️ Flight Booking</h1>
        <p>Find and book the perfect flights for your journey</p>
      </div>

      <div className="booking-content">
        <div className="search-section">
          <div className="card">
            <h2>Search Flights</h2>
            
            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={searchFlights} className="search-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="origin">From</label>
                  <input
                    type="text"
                    id="origin"
                    name="origin"
                    className="form-control"
                    value={searchData.origin}
                    onChange={handleSearchChange}
                    required
                    placeholder="Origin city"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="destination">To</label>
                  <input
                    type="text"
                    id="destination"
                    name="destination"
                    className="form-control"
                    value={searchData.destination}
                    onChange={handleSearchChange}
                    required
                    placeholder="Destination city"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="departureDate">Departure Date</label>
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
                  <label htmlFor="returnDate">Return Date (Optional)</label>
                  <input
                    type="date"
                    id="returnDate"
                    name="returnDate"
                    className="form-control"
                    value={searchData.returnDate}
                    onChange={handleSearchChange}
                  />
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
                  {[1,2,3,4,5,6,7,8].map(num => (
                    <option key={num} value={num}>{num} Passenger{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-full"
                disabled={loading}
              >
                {loading ? 'Searching...' : 'Search Flights'}
              </button>
            </form>
          </div>
        </div>

        <div className="results-section">
          {flights.length > 0 && (
            <div className="card">
              <h2>Available Flights</h2>
              <div className="results-list">
                {flights.map(flight => (
                  <div key={flight.flightId} className="result-item">
                    <div className="result-header">
                      <h3>{flight.airline}</h3>
                      <div className="price">${flight.price}</div>
                    </div>
                    
                    <div className="result-details">
                      <div className="route">
                        <span className="route-info">
                          {flight.origin} → {flight.destination}
                        </span>
                        <span className="flight-number">Flight {flight.flightNumber}</span>
                      </div>
                      
                      <div className="times">
                        <span>Departure: {new Date(flight.departureTime).toLocaleString()}</span>
                        <span>Arrival: {new Date(flight.arrivalTime).toLocaleString()}</span>
                      </div>
                      
                      <div className="duration">
                        Duration: {flight.duration}
                      </div>
                    </div>
                    
                    <div className="result-actions">
                      <button
                        onClick={() => bookFlight(flight)}
                        className="btn btn-success"
                      >
                        Book Flight
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="card">
            <h2>Your Flight Bookings</h2>
            {bookings.length > 0 ? (
              <div className="bookings-list">
                {bookings.map(booking => (
                  <div key={booking.bookingId} className="booking-item">
                    <div className="booking-header">
                      <h3>{booking.flight.airline}</h3>
                      <span className="booking-status confirmed">Confirmed</span>
                    </div>
                    
                    <div className="booking-details">
                      <div className="booking-route">
                        {booking.flight.origin} → {booking.flight.destination}
                      </div>
                      <div className="booking-info">
                        <span>Flight: {booking.flight.flightNumber}</span>
                        <span>Passengers: {booking.passengers}</span>
                        <span>Total: ${booking.totalPrice}</span>
                      </div>
                      <div className="booking-dates">
                        Departure: {new Date(booking.flight.departureTime).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">✈️</div>
                <h3>No flight bookings yet</h3>
                <p>Search and book your first flight!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightBooking;
