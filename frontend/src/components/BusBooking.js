import React, { useState, useEffect } from 'react';
import './Booking.css';

const BusBooking = ({ user }) => {
  const [searchData, setSearchData] = useState({
    origin: '',
    destination: '',
    departureDate: '',
    passengers: 1
  });
  const [buses, setBuses] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/buses/bookings/user/${user.userId}`);
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

  const searchBuses = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/buses/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchData),
      });

      const data = await response.json();
      if (data.success) {
        setBuses(data.data || []);
      } else {
        setError(data.message || 'Failed to search buses');
      }
    } catch (error) {
      setError('Network error. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const bookBus = async (bus) => {
    try {
      const response = await fetch('http://localhost:8080/api/buses/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.userId,
          busId: bus.busId,
          passengers: searchData.passengers,
          totalPrice: bus.price * searchData.passengers
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSuccess('Bus booked successfully!');
        fetchBookings();
      } else {
        setError(data.message || 'Failed to book bus');
      }
    } catch (error) {
      setError('Network error occurred');
    }
  };

  return (
    <div className="booking-page bus-booking">
      <div className="booking-header">
        <h1>🚌 Bus Booking</h1>
        <p>Find affordable and comfortable bus rides</p>
      </div>

      <div className="booking-content">
        <div className="search-section">
          <div className="card">
            <h2>Search Buses</h2>
            
            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={searchBuses} className="search-form">
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
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-full"
                disabled={loading}
              >
                {loading ? 'Searching...' : 'Search Buses'}
              </button>
            </form>
          </div>
        </div>

        <div className="results-section">
          {buses.length > 0 && (
            <div className="card">
              <h2>Available Buses</h2>
              <div className="results-list">
                {buses.map(bus => (
                  <div key={bus.busId} className="result-item">
                    <div className="result-header">
                      <h3>{bus.operator}</h3>
                      <div className="price">${bus.price}</div>
                    </div>
                    
                    <div className="result-details">
                      <div className="route">
                        <span className="route-info">
                          {bus.origin} → {bus.destination}
                        </span>
                        <span className="flight-number">Bus {bus.busNumber}</span>
                      </div>
                      
                      <div className="times">
                        <span>Departure: {new Date(bus.departureTime).toLocaleString()}</span>
                        <span>Arrival: {new Date(bus.arrivalTime).toLocaleString()}</span>
                      </div>
                      
                      <div className="duration">
                        Duration: {bus.duration}
                      </div>

                      <div className="amenities">
                        {bus.amenities && bus.amenities.split(',').map((amenity, index) => (
                          <span key={index} className="amenity">{amenity.trim()}</span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="result-actions">
                      <button
                        onClick={() => bookBus(bus)}
                        className="btn btn-success"
                      >
                        Book Bus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="card">
            <h2>Your Bus Bookings</h2>
            {bookings.length > 0 ? (
              <div className="bookings-list">
                {bookings.map(booking => (
                  <div key={booking.bookingId} className="booking-item">
                    <div className="booking-header">
                      <h3>{booking.bus.operator}</h3>
                      <span className="booking-status confirmed">Confirmed</span>
                    </div>
                    
                    <div className="booking-details">
                      <div className="booking-route">
                        {booking.bus.origin} → {booking.bus.destination}
                      </div>
                      <div className="booking-info">
                        <span>Bus: {booking.bus.busNumber}</span>
                        <span>Passengers: {booking.passengers}</span>
                        <span>Total: ${booking.totalPrice}</span>
                      </div>
                      <div className="booking-dates">
                        Departure: {new Date(booking.bus.departureTime).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🚌</div>
                <h3>No bus bookings yet</h3>
                <p>Search and book your first bus ride!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusBooking;
