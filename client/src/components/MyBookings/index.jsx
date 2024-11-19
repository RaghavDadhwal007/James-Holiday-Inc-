import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./myBookings.css";
import Header from "../Header";
import Footer from "../Footer";

const FALLBACK_IMAGE = "/api/placeholder/400/300";

const MyBookings = () => {
  // Removed unused setActiveTab since tabs are commented out
  const [bookingsData, setBookingsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getRoomImage = (roomType) => {
    try {
      if (roomType?.images?.length > 0) {
        const primaryImage =
          roomType.images.find((img) => img.isPrimary) || roomType.images[0];
        return `${process.env.REACT_APP_SERVER_URI}${primaryImage.url}`;
      }
      return FALLBACK_IMAGE;
    } catch (error) {
      console.error("Error getting room image:", error);
      return FALLBACK_IMAGE;
    }
  };

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const user_id = localStorage.getItem("user_id");
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URI}/booking`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }

      const data = await response.json();
      console.log("data", data);
      setBookingsData(
        data.filter((booking) => booking.user_id._id === user_id)
      );
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const calculateNights = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.round((end - start) / (1000 * 60 * 60 * 24));
  };

  const handleCancelBooking = async (
    bookingId,
    customerEmail,
    isCheckedIn,
    alreadyCheckedIn
  ) => {
    try {
      const token = localStorage.getItem("token");
      console.log(bookingId, "bookingId", customerEmail);

      if (alreadyCheckedIn) {
        alert("You have already checkedOut");
        return;
      }

      if (!isCheckedIn) {
        await fetch(`${process.env.REACT_APP_SERVER_URI}/qr`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ bookingId, customerEmail }),
        });

        alert("Please check your mail to check in");
      } else {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_URI}/booking/${bookingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              alreadyCheckedIn: true,
              isCheckedIn: false,
            }),
          }
        );
        const result = await response.json();
        if (result.success) {
          console.log("result!", result.message);
          await fetchBookings();
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to cancel booking. Please try again.");
    }
  };

  // Simplified to just return bookingsData since filtering is commented out
  const getFilteredBookings = () => bookingsData;

  if (loading) {
    return (
      <div className="mb-page">
        <Header />
        <div className="mb-loading">
          <div className="mb-spinner"></div>
          <p>Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-page">
        <Header />
        <div className="mb-error">
          <h3>Oops! Something went wrong</h3>
          <p>{error}</p>
          <Link to="/" className="mb-home-btn">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-page">
      <Header />
      <div className="mb-container">
        <div className="mb-header">
          <h1>My Bookings</h1>
        </div>

        <div className="mb-content">
          {getFilteredBookings().length === 0 ? (
            <div className="mb-empty">
              <div className="mb-empty-icon">📅</div>
              <h3>No bookings found</h3>
              <p>Looking for your perfect stay?</p>
              <Link to="/roomsList" className="mb-browse-btn">
                Browse Rooms
              </Link>
            </div>
          ) : (
            <div className="mb-bookings">
              {getFilteredBookings().map((booking) => (
                <div key={booking._id} className="mb-booking-card">
                  <div className="mb-booking-image">
                    <img
                      src={getRoomImage(booking.room_id?.room_type)}
                      alt={booking.room_id?.room_type?.type || "Room"}
                    />
                    <div
                      className={`mb-status mb-status-${booking.status?.toLowerCase()}`}
                    >
                      {booking.status}
                    </div>
                  </div>

                  <div className="mb-booking-info">
                    <div className="mb-booking-header">
                      <h3>{booking.room_id?.room_type?.type}</h3>
                      <span className="mb-booking-id">
                        #{booking._id.slice(-6)}
                      </span>
                    </div>

                    <div className="mb-booking-details">
                      <div className="mb-detail">
                        <span>Check-in</span>
                        <strong>{formatDate(booking.check_in_date)}</strong>
                      </div>
                      <div className="mb-detail">
                        <span>Check-out</span>
                        <strong>{formatDate(booking.check_out_date)}</strong>
                      </div>
                      <div className="mb-detail">
                        <span>Guests</span>
                        <strong>{booking.number_of_guests}</strong>
                      </div>
                      <div className="mb-detail">
                        <span>Duration</span>
                        <strong>
                          {calculateNights(
                            booking.check_in_date,
                            booking.check_out_date
                          )}{" "}
                          nights
                        </strong>
                      </div>
                    </div>

                    <div className="mb-booking-footer">
                      <div className="mb-price">
                        <span>Total</span>
                        <strong>
                          $
                          {Number(booking.total_amount.$numberDecimal).toFixed(
                            2
                          )}
                        </strong>
                      </div>

                      <div className="mb-actions">
                        <button
                          onClick={() =>
                            handleCancelBooking(
                              booking._id,
                              booking.user_id.email,
                              booking.isCheckedIn,
                              booking.alreadyCheckedIn
                            )
                          }
                          className="mb-cancel-btn"
                        >
                          {booking.isCheckedIn
                            ? "Click here to checkOut"
                            : "Click here to checkIn"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyBookings;
