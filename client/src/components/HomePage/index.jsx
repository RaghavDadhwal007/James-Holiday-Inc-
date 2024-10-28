import React from "react";
import { Link } from "react-router-dom";
import "./homePage.css";

function HomePage() {
  return (
    <>
    <header className="header">
        <nav className="navbar">
          <div className="logo">
            <img
              src="https://png.pngtree.com/png-vector/20220419/ourmid/pngtree-vector-template-for-innovative-jh-letter-logo-design-with-linked-initials-vector-png-image_30077126.png"
              alt="Hotel Logo"
              className="logo-image"
            />
            <h1 className="company-name">James Holiday Inc.</h1>
          </div>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/rooms">Rooms</Link></li>
            <li><Link to="/my-bookings">My Bookings</Link></li>
            <li><Link to="/user-profile">My Profile</Link></li>
            <li><Link to="/contact-us">Contact Us</Link></li>
            <li><Link to="/" className="Sign-Out">Sign-Out</Link></li>
          </ul>
        </nav>
      </header>
    <div>
      

      {/* Hero Section */}
      <section className="hero">
        <img
          src="https://i0.wp.com/theluxurytravelexpert.com/wp-content/uploads/2017/10/six-senses-zil-payson-seychelles.jpg?fit=1300%2C731&ssl=1"
          alt="Hotel"
          className="hero-image"
        />
        <div className="hero-text">
          <h1>
            Experience the <span>Luxury</span>
          </h1>
          <p>Find your perfect room today and enjoy a world-class experience.</p>
          <div className="search-bar">
            <input type="date" placeholder="Check-in Date" />
            <input type="date" placeholder="Check-out Date" />
            <input type="number" placeholder="Guests" min="1" />
            <select>
              <option value="">Room Type</option>
              <option value="single">Single Room</option>
              <option value="double">Double Room</option>
              <option value="suite">Suite</option>
            </select>
            <button className="search-btn">Check Availability</button>
          </div>
        </div>
      </section>

      {/* Featured Rooms Section */}
      <section className="featured-rooms">
        <h2>Featured Rooms</h2>
        <div className="room-cards">
          <div className="room-card">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-9adA4eaOlSpe_LJEKzxGJjigLJtjGs8ATg&s"
              alt="Deluxe Room"
            />
            <div className="room-info">
              <h3>Deluxe Room</h3>
              <p className="price">$200 / night</p>
              <ul className="features">
                <li>King-sized bed</li>
                <li>Free Wi-Fi</li>
                <li>Mountain view</li>
              </ul>
              <Link to="/room-details/Deluxe" className="view-details-btn">
                View Details
              </Link>
            </div>
          </div>
          
        </div>
      </section>

      {/* Amenities Section */}
      <section className="amenities">
        <h2>Our Amenities</h2>
        <div className="amenities-list">
          <div className="amenity-card">
            <img
              src="https://db0dce98.rocketcdn.me/wp-content/uploads/2023/07/Illu_BLOG__WLAN.png"
              alt="Free Wi-Fi"
            />
            <p>Free Wi-Fi</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 James Holiday Inc. All rights reserved.</p>
        <ul className="quick-links">
          <li><Link to="#">Terms of Service</Link></li>
          <li><Link to="#">Privacy Policy</Link></li>
        </ul>
      </footer>
    </div>
    </>

  );
}

export default HomePage;
