import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./myBookings.css";
import Header from "../Header";
import Footer from "../Footer";

const MyBookings = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [bookingsData, setBookingsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const response = await fetch(
          `${process.env.REACT_APP_SERVER_URI}/booking`,
          { headers }
        );

        const data = await response.json();
        setBookingsData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "status-upcoming";
      case "completed":
        return "status-completed";
      case "canceled":
        return "status-cancelled";
      default:
        return "";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const calculateNights = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = (end - start) / (1000 * 60 * 60 * 24);
    return Math.round(nights);
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URI}/booking/${bookingId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "Canceled" }),
        }
      );

      if (response.ok) {
        const updatedBookings = bookingsData.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: "Canceled" }
            : booking
        );
        setBookingsData(updatedBookings);
      } else {
        throw new Error("Failed to cancel booking");
      }
    } catch (error) {
      console.error("Error canceling booking:", error);
      alert("Failed to cancel booking. Please try again.");
    }
  };

  const filteredBookings = bookingsData.filter((booking) => {
    const bookingDate = new Date(booking.check_out_date);
    const today = new Date();

    switch (activeTab) {
      case "upcoming":
        return bookingDate >= today && booking.status !== "Canceled";
      case "completed":
        return bookingDate < today && booking.status !== "Canceled";
      case "cancelled":
        return booking.status === "Canceled";
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <div className="mybookings-container">
        <Header />
        <div className="loading-spinner">Loading bookings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mybookings-container">
        <Header />
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="mybookings-container">
        <div className="mybookings-header">
          <h1>My Bookings</h1>
          <p>Manage and view your bookings</p>
        </div>

        <div className="booking-tabs">
          <button
            className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All Bookings
          </button>
          <button
            className={`tab-btn ${activeTab === "upcoming" ? "active" : ""}`}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming
          </button>
          <button
            className={`tab-btn ${activeTab === "completed" ? "active" : ""}`}
            onClick={() => setActiveTab("completed")}
          >
            Completed
          </button>
          <button
            className={`tab-btn ${activeTab === "cancelled" ? "active" : ""}`}
            onClick={() => setActiveTab("cancelled")}
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
              <Link to="/roomsList" className="browse-rooms-btn">
                Browse Rooms
              </Link>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <div key={booking._id} className="booking-card">
                <div className="booking-image">
                  <img
                    src="/api/placeholder/400/300"
                    alt={booking.room_id?.room_type?.type || "Room"}
                  />
                  <span
                    className={`booking-status ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                </div>

                <div className="booking-details">
                  <div className="booking-header">
                    <h3>{booking.room_id?.room_type?.type}</h3>
                    <span className="booking-id">
                      Booking ID: {booking._id}
                    </span>
                  </div>

                  <div className="stay-details">
                    <div className="stay-item">
                      <span className="stay-label">Check-in</span>
                      <span className="stay-value">
                        {formatDate(booking.check_in_date)}
                      </span>
                    </div>
                    <div className="stay-item">
                      <span className="stay-label">Check-out</span>
                      <span className="stay-value">
                        {formatDate(booking.check_out_date)}
                      </span>
                    </div>
                    <div className="stay-item">
                      <span className="stay-label">Guests</span>
                      <span className="stay-value">
                        {booking.number_of_guests} Person(s)
                      </span>
                    </div>
                    <div className="stay-item">
                      <span className="stay-label">Duration</span>
                      <span className="stay-value">
                        {calculateNights(
                          booking.check_in_date,
                          booking.check_out_date
                        )}{" "}
                        Night(s)
                      </span>
                    </div>
                  </div>

                  <div className="booking-footer">
                    <div className="price-info">
                      <span className="price-label">Total Amount</span>
                      <span className="price-value">
                        $
                        {Number(booking.total_amount.$numberDecimal).toFixed(2)}
                      </span>
                    </div>

                    <div className="booking-actions">
                      {booking.status !== "Canceled" &&
                        new Date(booking.check_in_date) > new Date() && (
                          <>
                            <Link
                              to={`/modify-booking/${booking._id}`}
                              className="action-btn modify-btn"
                            >
                              Modify
                            </Link>
                            <button
                              onClick={() => handleCancelBooking(booking._id)}
                              className="action-btn cancel-btn"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                      <Link
                        to={`/booking/${booking._id}`}
                        className="action-btn view-btn"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default MyBookings;
