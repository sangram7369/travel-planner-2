import React, { useState, useEffect } from 'react';
import './Booking.css';

const HotelBooking = ({ user }) => {
  const [searchData, setSearchData] = useState({
    location: '',
    checkInDate: '',
    checkOutDate: '',
    guests: 1,
    rooms: 1
  });
  const [hotels, setHotels] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/hotels/bookings/user/${user.userId}`);
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

  const searchHotels = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/hotels/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchData),
      });

      const data = await response.json();
      if (data.success) {
        setHotels(data.data || []);
      } else {
        setError(data.message || 'Failed to search hotels');
      }
    } catch (error) {
      setError('Network error. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const bookHotel = async (hotel) => {
    try {
      const response = await fetch('http://localhost:8080/api/hotels/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.userId,
          hotelId: hotel.hotelId,
          checkInDate: searchData.checkInDate,
          checkOutDate: searchData.checkOutDate,
          guests: searchData.guests,
          rooms: searchData.rooms,
          totalPrice: hotel.pricePerNight * searchData.rooms * calculateNights()
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSuccess('Hotel booked successfully!');
        fetchBookings();
      } else {
        setError(data.message || 'Failed to book hotel');
      }
    } catch (error) {
      setError('Network error occurred');
    }
  };

  const calculateNights = () => {
    if (searchData.checkInDate && searchData.checkOutDate) {
      const checkIn = new Date(searchData.checkInDate);
      const checkOut = new Date(searchData.checkOutDate);
      const timeDiff = checkOut.getTime() - checkIn.getTime();
      return Math.ceil(timeDiff / (1000 * 3600 * 24));
    }
    return 1;
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'star filled' : 'star'}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="booking-page hotel-booking">
      <div className="booking-header">
        <h1>🏨 Hotel Booking</h1>
        <p>Find the perfect accommodation for your stay</p>
      </div>

      <div className="booking-content">
        <div className="search-section">
          <div className="card">
            <h2>Search Hotels</h2>
            
            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={searchHotels} className="search-form">
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  className="form-control"
                  value={searchData.location}
                  onChange={handleSearchChange}
                  required
                  placeholder="City or hotel name"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="checkInDate">Check-in Date</label>
                  <input
                    type="date"
                    id="checkInDate"
                    name="checkInDate"
                    className="form-control"
                    value={searchData.checkInDate}
                    onChange={handleSearchChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="checkOutDate">Check-out Date</label>
                  <input
                    type="date"
                    id="checkOutDate"
                    name="checkOutDate"
                    className="form-control"
                    value={searchData.checkOutDate}
                    onChange={handleSearchChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="guests">Guests</label>
                  <select
                    id="guests"
                    name="guests"
                    className="form-control"
                    value={searchData.guests}
                    onChange={handleSearchChange}
                  >
                    {[1,2,3,4,5,6].map(num => (
                      <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="rooms">Rooms</label>
                  <select
                    id="rooms"
                    name="rooms"
                    className="form-control"
                    value={searchData.rooms}
                    onChange={handleSearchChange}
                  >
                    {[1,2,3,4].map(num => (
                      <option key={num} value={num}>{num} Room{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-full"
                disabled={loading}
              >
                {loading ? 'Searching...' : 'Search Hotels'}
              </button>
            </form>
          </div>
        </div>

        <div className="results-section">
          {hotels.length > 0 && (
            <div className="card">
              <h2>Available Hotels</h2>
              <div className="results-list">
                {hotels.map(hotel => (
                  <div key={hotel.hotelId} className="result-item">
                    <div className="result-header">
                      <h3>{hotel.name}</h3>
                      <div className="price">${hotel.pricePerNight}/night</div>
                    </div>
                    
                    <div className="result-details">
                      <div className="rating">
                        <div className="stars">
                          {renderStars(hotel.rating)}
                        </div>
                        <span className="rating-text">({hotel.rating}/5)</span>
                      </div>
                      
                      <div className="hotel-location">
                        📍 {hotel.location}
                      </div>
                      
                      {hotel.description && (
                        <div className="hotel-description">
                          <p>{hotel.description}</p>
                        </div>
                      )}

                      {hotel.amenities && (
                        <div className="amenities">
                          {hotel.amenities.split(',').map((amenity, index) => (
                            <span key={index} className="amenity">{amenity.trim()}</span>
                          ))}
                        </div>
                      )}

                      <div className="stay-details">
                        <span>Total: {calculateNights()} night{calculateNights() > 1 ? 's' : ''}</span>
                        <span>Total Price: ${(hotel.pricePerNight * searchData.rooms * calculateNights()).toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="result-actions">
                      <button
                        onClick={() => bookHotel(hotel)}
                        className="btn btn-success"
                      >
                        Book Hotel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="card">
            <h2>Your Hotel Bookings</h2>
            {bookings.length > 0 ? (
              <div className="bookings-list">
                {bookings.map(booking => (
                  <div key={booking.bookingId} className="booking-item">
                    <div className="booking-header">
                      <h3>{booking.hotel.name}</h3>
                      <span className="booking-status confirmed">Confirmed</span>
                    </div>
                    
                    <div className="booking-details">
                      <div className="booking-route">
                        📍 {booking.hotel.location}
                      </div>
                      <div className="rating">
                        <div className="stars">
                          {renderStars(booking.hotel.rating)}
                        </div>
                        <span className="rating-text">({booking.hotel.rating}/5)</span>
                      </div>
                      <div className="booking-info">
                        <span>Check-in: {new Date(booking.checkInDate).toLocaleDateString()}</span>
                        <span>Check-out: {new Date(booking.checkOutDate).toLocaleDateString()}</span>
                        <span>Guests: {booking.guests}</span>
                        <span>Rooms: {booking.rooms}</span>
                        <span>Total: ${booking.totalPrice}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🏨</div>
                <h3>No hotel bookings yet</h3>
                <p>Search and book your first hotel stay!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelBooking;
