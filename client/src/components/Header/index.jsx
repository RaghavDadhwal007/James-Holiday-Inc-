import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./header.css";

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  console.log('token', token)
  useEffect(() => {
    setToken(localStorage.getItem('token') || '')
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOUt = () => {
    setToken('');
    localStorage.removeItem('token')
  }

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : 'navbar-transparent'}`}>
    <div className="logo">
      <img 
        src="https://png.pngtree.com/png-vector/20220419/ourmid/pngtree-vector-template-for-innovative-jh-letter-logo-design-with-linked-initials-vector-png-image_30077126.png"
        alt="James Holiday Inc Logo" 
        className="logo-image"
      />
      <span className="company-name">
        James Holiday Inc.
      </span>
    </div>
    <ul className="nav-links">
      <li><Link to="/">Home</Link></li>
      <li><Link to="/roomsList">Rooms</Link></li>
      <li><Link to="/booking">Bookings</Link></li>
      <li><Link to="/about">About</Link></li>
      <li><Link to="/contact">Contact</Link></li>
      <li>
        {
          !token ? 
          <Link 
          to="/login" 
          className={`login-btn ${isScrolled ? 'login-btn-scrolled' : 'login-btn-transparent'}`}
          >
          Sign In
        </Link> : <button onClick={handleSignOUt}>Sign Out</button>
        }
      </li>
    </ul>
  </nav>
  );
}

export default Header;