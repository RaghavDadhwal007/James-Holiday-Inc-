import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./success.css";

const SuccessPage = () => {
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const sessionId = queryParams.get("session_id");

    if (sessionId) {
      confirmPayment(sessionId);
    }
  }, [location]);

  const confirmPayment = async (sessionId) => {
    const response = await fetch(
      `${process.env.REACT_APP_SERVER_URI}/payment/confirm-payment`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ session_id: sessionId }),
      }
    );

    const result = await response.json();

    if (result.success) {
      console.log("Payment confirmed and booking updated!");
    } else {
      console.error("Payment confirmation failed.");
    }
  };

  return (
    <div className="success-container">
      <div className="success-card">
        <h1>🎉 Payment Successful!</h1>
        <p>Thank you for your payment. Your booking has been confirmed.</p>
        <p>We’ve sent a confirmation to your email.</p>

        <Link to="/myBookings" className="bookings-link">
          View My Bookings
        </Link>
      </div>
    </div>
  );
};

export default SuccessPage;
