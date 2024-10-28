import React from 'react';
import { Link } from 'react-router-dom';
import '../HomePage/homePage.css';

const RoomsList = () => {
  return (
    <div>
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
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/rooms">Rooms</Link></li>
            <li><Link to="/mybookings">My Bookings</Link></li>
            <li><Link to="/userprofile">My Profile</Link></li>
            <li><Link to="/contactus">Contact Us</Link></li>
            <li><Link to="/" className="sign-out">Sign-Out</Link></li>
          </ul>
        </nav>
        <h1>Available Rooms</h1>
      </header>

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

      <section className="rooms">
        <div className="room-cards">
          {[
            { title: 'Deluxe Room', price: '$200 / night', imgSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-9adA4eaOlSpe_LJEKzxGJjigLJtjGs8ATg&s', link: '/roomdetails/Deluxe' },
            { title: 'Luxury Suite', price: '$350 / night', imgSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRD6Kn6DuellFmvWWhJAmHXTedcQTEyJP8wgg&s', link: '/roomdetails/LuxurySuite' },
            { title: 'Family Room', price: '$250 / night', imgSrc: 'https://www.landmarklondon.co.uk/wp-content/uploads/2019/05/Executive-Family-1800x1200-1.jpg', link: '/roomdetails/Family' },
            { title: 'Single Room', price: '$120 / night', imgSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFGJOI1ugVJ4Zr-KGvNipsz6ObhM1FW4DVlw&s', link: '/roomdetails/Single' },
            { title: 'Double Room', price: '$180 / night', imgSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSf9bvFSwblzobz_rpZpN9LNxZoCliyi5eZPA&s', link: '/roomdetails/Double' },
            { title: 'Executive Suite', price: '$400 / night', imgSrc: 'https://wedgewoodhotel.com/wp-content/uploads/2023/04/Wedgewood_Hotel_123-1680x0-c-default.jpg', link: '/roomdetails/ExecutiveSuite' },
            { title: 'Presidential Suite', price: '$600 / night', imgSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLu8FCt2KR1G5sKLj-3k-eiHOGpndItlH6Cw&s', link: '/roomdetails/PresidentialSuite' },
            { title: 'Ocean View Room', price: '$220 / night', imgSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQU8wtCeoV6WwgF7AxMZ7Pb1WbRtWcSnaXY0g&s', link: '/roomdetails/OceanView' },
            { title: 'Garden Room', price: '$210 / night', imgSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPrr25hTNkdaFCMtAkm0D2uX_MDXIE7cQjnw&s', link: '/roomdetails/Garden' },
            { title: 'Penthouse', price: '$700 / night', imgSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyccCrDBKZUHtMlIUY5blLeWdFppiPrD9oCg&s', link: '/roomdetails/Penthouse' }
          ].map((room, index) => (
            <div key={index} className="room-card">
              <img src={room.imgSrc} alt={room.title} />
              <h3>{room.title}</h3>
              <p>{room.price}</p>
              <Link to={room.link} className="view-details-btn">View Details</Link>
            </div>
          ))}
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2024 James Holiday Inc. All rights reserved.</p>
        <ul className="quick-links">
          <li><Link to="/terms">Terms of Service</Link></li>
          <li><Link to="/privacy">Privacy Policy</Link></li>
        </ul>
      </footer>
    </div>
  );
};

export default RoomsList;
