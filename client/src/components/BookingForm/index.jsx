import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../HomePage/homePage.css";
import "./bookingForm.css";

function BookingForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    roomType: "Deluxe",
    guests: 1,
    name: "",
    phone: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/payment", { state: formData });
  };

  return (
    <section className="booking-form">
      <h1>Booking Details</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="room-type">Room Type:</label>
        <input type="text" id="room-type" name="roomType" value={formData.roomType} readOnly />

        <label htmlFor="guests">Number of Guests:</label>
        <input type="number" id="guests" name="guests" min="1" value={formData.guests} onChange={handleChange} required />

        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />

        <label htmlFor="phone">Phone:</label>
        <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required />

        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />

        <button type="submit" className="pay-now-btn">Pay Now</button>
      </form>
    </section>
  );
}

export default BookingForm;
