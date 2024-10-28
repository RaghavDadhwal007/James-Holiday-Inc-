import React from 'react';
import { Link } from 'react-router-dom';
import './userProfile.css';

const UserProfile = () => {
  return (
    <div>
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

      <div className="center-content">
        <div className="profile-container">
          <h2>My Profile</h2>
          <img
            src="https://via.placeholder.com/120"
            alt="Profile"
            className="profile-picture"
          />

          <div className="profile-info">
            <div>
              <label>Full Name</label>
              <p>Gurdas Singh</p>
            </div>
            <div>
              <label>Email</label>
              <p>gsingh@gmail.com</p>
            </div>
            <div>
              <label>Phone</label>
              <p>+1 234 567 890</p>
            </div>
            <div>
              <label>Address</label>
              <p>123 Main St, Brampton, CA</p>
            </div>
          </div>

          <div className="preferences">
            <label>Preferences</label>
            <p>Room Type: Suite</p>
            <p>Newsletter Subscription: Yes</p>
          </div>

          <Link to="/editprofile" className="edit-profile-btn">Edit Profile</Link>
        </div>
      </div>

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

export default UserProfile;
