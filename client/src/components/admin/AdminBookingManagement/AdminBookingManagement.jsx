import React, { useState, useEffect } from "react";
import "./adminBookingManagement.css";

const AdminBookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URI}/booking`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch bookings");

      const data = await response.json();
      console.log("data", data);
      // Fetch related data for each booking
      // const populatedBookings = await Promise.all(
      //   data.map(async (booking) => {
      //     const [userResponse, roomResponse] = await Promise.all([
      //       fetch(
      //         `${process.env.REACT_APP_SERVER_URI}/users/${booking.user_id}`
      //       ),
      //       fetch(
      //         `${process.env.REACT_APP_SERVER_URI}/rooms/${booking.room_id}`
      //       ),
      //     ]);

      //     const [userData, roomData] = await Promise.all([
      //       userResponse.json(),
      //       roomResponse.json(),
      //     ]);

      //     return {
      //       ...booking,
      //       user: userData,
      //       room: roomData,
      //     };
      //   })
      // );

      setBookings(data);
    } catch (err) {
      setError("Failed to fetch bookings");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (isCheckedIn) => {
    if (isCheckedIn) {
      return "status-confirmed";
    }
    return "status-canceled";
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "payment-completed";
      case "Pending":
        return "payment-pending";
      case "Failed":
        return "payment-failed";
      default:
        return "";
    }
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesStatus =
      filterStatus === "all" || booking.status === filterStatus;
    const matchesSearch =
      booking.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking._id?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const BookingModal = ({ booking, onClose }) => (
    <div className="abm-modal-overlay">
      <div className="abm-modal">
        <div className="abm-modal-header">
          <h2>Booking Details</h2>
          <button onClick={onClose} className="abm-modal-close">
            ×
          </button>
        </div>
        <div className="abm-modal-content">
          <div className="abm-detail-section">
            <h3>Guest Information</h3>
            <p>
              <strong>Name:</strong> {booking.user_id?.name}
            </p>
            <p>
              <strong>Email:</strong> {booking.user_id?.email}
            </p>
            <p>
              <strong>Phone:</strong> {booking.user_id?.phone}
            </p>
          </div>

          <div className="abm-detail-section">
            <h3>Room Information</h3>
            <p>
              <strong>Room Type:</strong> {booking.room_id?.room_type?.type}
            </p>
            <p>
              <strong>Room Price:</strong> $
              {booking.room_id?.price.$numberDecimal}
              /night
            </p>
            <p>
              <strong>Number of Guests:</strong> {booking.number_of_guests}
            </p>
          </div>

          <div className="abm-detail-section">
            <h3>Booking Information</h3>
            <p>
              <strong>Check-in:</strong> {formatDate(booking.check_in_date)}
            </p>
            <p>
              <strong>Check-out:</strong> {formatDate(booking.check_out_date)}
            </p>
            <p>
              <strong>Checked In Status:</strong>{" "}
              <span
                className={`abm-status ${getStatusColor(booking.isCheckedIn)}`}
              >
                {booking.isCheckedIn ? "Yes" : "No"}
              </span>
            </p>
          </div>

          <div className="abm-detail-section">
            <h3>Payment Information</h3>
            <p>
              <strong>Total Amount:</strong> $
              {booking.total_amount.$numberDecimal}
            </p>
            <p>
              <strong>Payment Method:</strong>{" "}
              {booking.payment_id?.payment_method}
            </p>
            <p>
              <strong>Payment Status:</strong>{" "}
              <span
                className={`abm-status ${getPaymentStatusColor(
                  booking.payment_id?.status
                )}`}
              >
                {booking.payment_id?.status}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="abm-container">
      <div className="abm-header">
        <h1>Booking Management</h1>
        <div className="abm-controls"></div>
      </div>

      {error && <div className="abm-error">{error}</div>}

      {loading ? (
        <div className="abm-loading">Loading bookings...</div>
      ) : (
        <div className="abm-table-container">
          <table className="abm-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Guest Name</th>
                <th>Room Type</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Total Amount</th>
                <th>Check-in Status</th>
                <th>Payment Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking._id}>
                  <td>{booking._id}</td>
                  <td>{booking.user_id?.name}</td>
                  <td>{booking.room_id?.room_type?.type}</td>
                  <td>{formatDate(booking.check_in_date)}</td>
                  <td>{formatDate(booking.check_out_date)}</td>
                  <td>${booking.total_amount.$numberDecimal}</td>
                  <td>
                    <span
                      className={`abm-status ${getStatusColor(
                        booking.isCheckedIn
                      )}`}
                    >
                      {booking.isCheckedIn ? "Yes" : "No"}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`abm-status ${getPaymentStatusColor(
                        booking.payment_id?.status
                      )}`}
                    >
                      {booking.payment_id?.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="abm-view-btn"
                      onClick={() => handleViewDetails(booking)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && selectedBooking && (
        <BookingModal
          booking={selectedBooking}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedBooking(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminBookingManagement;
