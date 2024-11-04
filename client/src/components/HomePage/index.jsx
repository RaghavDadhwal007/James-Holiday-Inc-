import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './homePage.css';
import Header from '../Header';

const HomePage = () => {
  const [searchData, setSearchData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    roomType: ''
  });

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Search Data:', searchData);
  };

  const featuredRooms = [
    {
      id: 1,
      name: 'Luxury Ocean Suite',
      price: 299,
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b',
      features: ['Ocean View', 'King Bed', 'Private Balcony', 'Mini Bar'],
      rating: 4.8,
      reviews: 124
    },
    {
      id: 2,
      name: 'Mountain View Deluxe',
      price: 249,
      image: 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061',
      features: ['Mountain View', 'Queen Bed', 'Workspace', 'Room Service'],
      rating: 4.6,
      reviews: 98
    },
    {
      id: 3,
      name: 'Executive Suite',
      price: 399,
      image: 'https://images.unsplash.com/photo-1590490359683-658d3d23f972',
      features: ['City View', 'King Bed', 'Living Room', 'Jacuzzi'],
      rating: 4.9,
      reviews: 156
    }
  ];

  return (
    <div className="homepage">
      <Header />
      <section className="hero">
        <img
          src="https://i0.wp.com/theluxurytravelexpert.com/wp-content/uploads/2017/10/six-senses-zil-payson-seychelles.jpg?fit=1300%2C731&ssl=1"
          alt="Luxury Hotel View"
          className="hero-image"
        />
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Experience Luxury Living</h1>
          <p>Discover comfort and elegance at its finest</p>
          
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-container">
              <div className="search-input">
                <span className="input-icon">📅</span>
                <input
                  type="date"
                  value={searchData.checkIn}
                  onChange={(e) => setSearchData({...searchData, checkIn: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              
              <div className="search-input">
                <span className="input-icon">📅</span>
                <input
                  type="date"
                  value={searchData.checkOut}
                  onChange={(e) => setSearchData({...searchData, checkOut: e.target.value})}
                  min={searchData.checkIn || new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              
              <div className="search-input">
                <span className="input-icon">👥</span>
                <input
                  type="number"
                  value={searchData.guests}
                  onChange={(e) => setSearchData({...searchData, guests: e.target.value})}
                  min="1"
                  max="10"
                  placeholder="Guests"
                  required
                />
              </div>
              
              <div className="search-input">
                <span className="input-icon">🏨</span>
                <select
                  value={searchData.roomType}
                  onChange={(e) => setSearchData({...searchData, roomType: e.target.value})}
                  required
                >
                  <option value="">Room Type</option>
                  <option value="standard">Standard</option>
                  <option value="deluxe">Deluxe</option>
                  <option value="suite">Suite</option>
                </select>
              </div>
              
              <button type="submit" className="search-button">
                <span>🔍</span> Search
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="featured-rooms">
        <h2>Featured Rooms</h2>
        <div className="room-grid">
          {featuredRooms.map(room => (
            <div key={room.id} className="room-card">
              <div className="room-image">
                <img src={room.image} alt={room.name} />
                <div className="room-price">${room.price}<span>/night</span></div>
              </div>
              <div className="room-details">
                <h3>{room.name}</h3>
                <div className="room-rating">
                  <span className="stars">⭐ {room.rating}</span>
                  <span className="reviews">({room.reviews} reviews)</span>
                </div>
                <ul className="room-features">
                  {room.features.map((feature, index) => (
                    <li key={index}>✓ {feature}</li>
                  ))}
                </ul>
                <div className="room-actions">
                  <Link to={`/rooms/${room.id}`} className="view-details">
                    View Details
                  </Link>
                  <button className="book-now">Book Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="amenities">
        <h2>Our Amenities</h2>
        <div className="amenities-grid">
          <div className="amenity-card">
            <span className="amenity-icon">🏊‍♂️</span>
            <h3>Swimming Pool</h3>
            <p>Outdoor infinity pool with ocean view</p>
          </div>
          <div className="amenity-card">
            <span className="amenity-icon">🍽️</span>
            <h3>Restaurant</h3>
            <p>24/7 fine dining experience</p>
          </div>
          <div className="amenity-card">
            <span className="amenity-icon">💆‍♂️</span>
            <h3>Spa Center</h3>
            <p>Relaxation and wellness treatments</p>
          </div>
          <div className="amenity-card">
            <span className="amenity-icon">🏋️‍♂️</span>
            <h3>Fitness Center</h3>
            <p>Modern equipment and trainers</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>James Holiday Inc.</h3>
            <p>Experience luxury and comfort</p>
            <div className="social-links">
              <a href="#" aria-label="Facebook">📱</a>
              <a href="#" aria-label="Twitter">📱</a>
              <a href="#" aria-label="Instagram">📱</a>
            </div>
          </div>
          
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/rooms">Our Rooms</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <p className="footer-section"> &copy; 2024 James Holiday Inc. All rights reserved.</p>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Contact</h3>
            <p>📍 123 Hotel Street, City</p>
            <p>📞 +1 234 567 890</p>
            <p>📧 info@jamesholiday.com</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;