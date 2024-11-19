import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "./checkIn.css";

const CheckIN = () => {
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      confirmCheckIn(id);
    }
  }, [id]);

  const confirmCheckIn = async (bookingId) => {
    const response = await fetch(
      `${process.env.REACT_APP_SERVER_URI}/booking/${bookingId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isCheckedIn: true }),
      }
    );

    const result = await response.json();

    if (result.success) {
      console.log("result!", result.message);
    } else {
      console.error("result!", result.message);
    }
  };

  return (
    <div className="success-container">
      <div className="success-card">
        <h1>🎉 Check IN Successful!</h1>
        <p>You have Successfully checked IN.</p>

        <Link to="/myBookings" className="bookings-link">
          View My Bookings
        </Link>
      </div>
    </div>
  );
};

export default CheckIN;
