import React from "react";
import { Link } from "react-router-dom";
import "../HomePage/homePage.css";
import "./myBookings.css";

function MyBookings() {
  const bookings = [
    {
      id: 1,
      roomType: "Deluxe",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-9adA4eaOlSpe_LJEKzxGJjigLJtjGs8ATg&s",
      checkIn: "2023-09-15",
      checkOut: "2023-09-20",
      price: "$1000",
    },
    {
      id: 2,
      roomType: "Luxury Suite",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRD6Kn6DuellFmvWWhJAmHXTedcQTEyJP8wgg&s",
      checkIn: "2023-08-10",
      checkOut: "2023-08-15",
      price: "$1750",
    },
    {
      id: 3,
      roomType: "Family",
      image: "https://www.landmarklondon.co.uk/wp-content/uploads/2019/05/Executive-Family-1800x1200-1.jpg",
      checkIn: "2023-07-05",
      checkOut: "2023-07-10",
      price: "$1250",
    },
  ];

  return (
    <section className="booking-cards">
      <h1>My Bookings</h1>
      {bookings.map((booking) => (
        <div className="booking-card" key={booking.id}>
          <img src={booking.image} alt={booking.roomType} />
          <div className="info">
            <h3>{booking.roomType}</h3>
            <p>Check-in: {booking.checkIn}</p>
            <p>Check-out: {booking.checkOut}</p>
            <p>Total Price: {booking.price}</p>
          </div>
          <Link to={`/roomdetails/${booking.roomType}`} className="view-details-btn">
            Book Again
          </Link>
        </div>
      ))}
    </section>
  );
}

export default MyBookings;
