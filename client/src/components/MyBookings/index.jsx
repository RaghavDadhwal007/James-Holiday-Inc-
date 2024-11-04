import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './myBookings.css';

const MyBookings = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  
  // Sample data - Replace with your actual data
  const bookings = [
    {
      id: "B001",
      roomType: "Deluxe Suite",
      checkIn: "2024-03-15",
      checkOut: "2024-03-18",
      guests: 2,
      totalAmount: 599,
      status: "upcoming",
      roomImage: "/api/placeholder/400/300"
    },
    {
      id: "B002",
      roomType: "Presidential Suite",
      checkIn: "2024-02-20",
      checkOut: "2024-02-22",
      guests: 3,
      totalAmount: 899,
      status: "completed",
      roomImage: "/api/placeholder/400/300"
    },
    {
      id: "B003",
      roomType: "Ocean View Room",
      checkIn: "2024-04-05",
      checkOut: "2024-04-08",
      guests: 2,
      totalAmount: 459,
      status: "upcoming",
      roomImage: "/api/placeholder/400/300"
    }
  ];

  const filteredBookings = bookings.filter(booking => 
    activeTab === 'all' || booking.status === activeTab
  );

  const getStatusColor = (status) => {
    switch(status) {
      case 'upcoming':
        return 'status-upcoming';
      case 'completed':
        return 'status-completed';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const calculateNights = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = (end - start) / (1000 * 60 * 60 * 24);
    return nights;
  };

  return (
    <div className="mybookings-container">
      <div className="mybookings-header">
        <h1>My Bookings</h1>
        <p>Manage and view your bookings</p>
      </div>

      <div className="booking-tabs">
        <button 
          className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Bookings
        </button>
        <button 
          className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming
        </button>
        <button 
          className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed
        </button>
        <button 
          className={`tab-btn ${activeTab === 'cancelled' ? 'active' : ''}`}
          onClick={() => setActiveTab('cancelled')}
        >
          Cancelled
        </button>
      </div>

      <div className="bookings-grid">
        {filteredBookings.length === 0 ? (
          <div className="no-bookings">
            <span className="no-bookings-icon">🏠</span>
            <h3>No bookings found</h3>
            <p>You haven't made any {activeTab} bookings yet</p>
            <Link to="/rooms" className="browse-rooms-btn">Browse Rooms</Link>
          </div>
        ) : (
          filteredBookings.map(booking => (
            <div key={booking.id} className="booking-card">
              <div className="booking-image">
                <img src={booking.roomImage} alt={booking.roomType} />
                <span className={`booking-status ${getStatusColor(booking.status)}`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>

              <div className="booking-details">
                <div className="booking-header">
                  <h3>{booking.roomType}</h3>
                  <span className="booking-id">Booking ID: {booking.id}</span>
                </div>

                <div className="stay-details">
                  <div className="stay-item">
                    <span className="stay-label">Check-in</span>
                    <span className="stay-value">{formatDate(booking.checkIn)}</span>
                  </div>
                  <div className="stay-item">
                    <span className="stay-label">Check-out</span>
                    <span className="stay-value">{formatDate(booking.checkOut)}</span>
                  </div>
                  <div className="stay-item">
                    <span className="stay-label">Guests</span>
                    <span className="stay-value">{booking.guests} Person(s)</span>
                  </div>
                  <div className="stay-item">
                    <span className="stay-label">Duration</span>
                    <span className="stay-value">
                      {calculateNights(booking.checkIn, booking.checkOut)} Night(s)
                    </span>
                  </div>
                </div>

                <div className="booking-footer">
                  <div className="price-info">
                    <span className="price-label">Total Amount</span>
                    <span className="price-value">${booking.totalAmount}</span>
                  </div>
                  
                  <div className="booking-actions">
                    {booking.status === 'upcoming' && (
                      <>
                        <button className="action-btn modify-btn">
                          Modify
                        </button>
                        <button className="action-btn cancel-btn">
                          Cancel
                        </button>
                      </>
                    )}
                    <button className="action-btn view-btn">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyBookings;