import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./header.css";

function Header() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setToken(localStorage.getItem("token") || "");
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = () => {
    setToken("");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav
      className={`jh-navbar ${
        isScrolled ? "jh-navbar-scrolled" : "jh-navbar-transparent"
      }`}
    >
      <div className="jh-nav-content">
        <Link to="/" className="jh-logo">
          <img
            src="https://png.pngtree.com/png-vector/20220419/ourmid/pngtree-vector-template-for-innovative-jh-letter-logo-design-with-linked-initials-vector-png-image_30077126.png"
            alt="James Holiday Inc Logo"
            className="jh-logo-image"
          />
          <span className="jh-company-name">James Holiday Inc.</span>
        </Link>

        <button
          className="jh-mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className="jh-menu-icon"></span>
        </button>

        <ul className={`jh-nav-links ${isMenuOpen ? "jh-nav-active" : ""}`}>
          <li className="jh-nav-item">
            <Link
              to="/"
              className="jh-nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
          </li>
          <li className="jh-nav-item">
            <Link
              to="/roomsList"
              className="jh-nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              Rooms
            </Link>
          </li>
          <li className="jh-nav-item">
            <Link
              to="/myBookings"
              className="jh-nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              My Bookings
            </Link>
          </li>
          <li className="jh-nav-item jh-auth-item">
            {!token ? (
              <Link
                to="/login"
                className="jh-login-btn"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
            ) : (
              <button onClick={handleSignOut} className="jh-signout-btn">
                Sign Out
              </button>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Header;
