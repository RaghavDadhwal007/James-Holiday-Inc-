import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "../HomePage/homePage.css";
import "./roomDetails.css";

function RoomDetails() {
  const { roomType } = useParams();
  const [slideIndex, setSlideIndex] = useState(0);

  const images = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-9adA4eaOlSpe_LJEKzxGJjigLJtjGs8ATg&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQU8wtCeoV6WwgF7AxMZ7Pb1WbRtWcSnaXY0g&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRD6Kn6DuellFmvWWhJAmHXTedcQTEyJP8wgg&s.jpg",
  ];

  const changeSlide = (direction) => {
    setSlideIndex((prevIndex) => (prevIndex + direction + images.length) % images.length);
  };

  return (
    <div>
      <header className="header">
        <h1>Room Details - {roomType}</h1>
      </header>

      <section className="room-detail">
        <div className="carousel">
          <div className="slides" style={{ transform: `translateX(-${slideIndex * 100}%)` }}>
            {images.map((src, index) => (
              <div className="slide" key={index}>
                <img src={src} alt={`Room Image ${index + 1}`} />
              </div>
            ))}
          </div>
          <button className="prev" onClick={() => changeSlide(-1)}>&#10094;</button>
          <button className="next" onClick={() => changeSlide(1)}>&#10095;</button>
        </div>

        <p>This deluxe room offers a luxury experience with a comfortable bed, free Wi-Fi, and more amenities.</p>
        <ul>
          <li>Free Wi-Fi</li>
          <li>24-hour Front Desk Service</li>
          <li>Room Service</li>
          <li>On-site Restaurant and Bar</li>
          <li>Swimming Pool</li>
          <li>Spa and Wellness Center</li>
          <li>Fitness Center</li>
          <li>Complimentary Breakfast</li>
          <li>Concierge Service</li>
        </ul>

        <p>Price: $200 / night</p>
        <a href={`/booking?room=${roomType}&price=200`} className="book-now-btn">Book Now</a>
      </section>

      <footer className="footer">
        <p>&copy; 2024 James Holiday Inc. All rights reserved.</p>
        <ul className="quick-links">
          <li><a href="#">Terms of Service</a></li>
          <li><a href="#">Privacy Policy</a></li>
        </ul>
      </footer>
    </div>
  );
}

export default RoomDetails;
