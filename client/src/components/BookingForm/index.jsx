import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./bookingForm.css";

function BookingForm() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    roomType: "Deluxe",
    checkIn: "",
    checkOut: "",
    guests: 1,
    name: "",
    phone: "",
    email: "",
    specialRequests: ""
  });

  useEffect(() => {
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

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/[-\s]/g, ''))) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    if (!formData.checkIn) {
      newErrors.checkIn = "Check-in date is required";
    }

    if (!formData.checkOut) {
      newErrors.checkOut = "Check-out date is required";
    }

    if (formData.checkIn && formData.checkOut) {
      const checkIn = new Date(formData.checkIn);
      const checkOut = new Date(formData.checkOut);
      if (checkOut <= checkIn) {
        newErrors.checkOut = "Check-out date must be after check-in date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      navigate("/payment", { state: formData });
    }
  };

  return (
    <div className="booking-page">
      {/* Navbar */}
      <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : 'navbar-transparent'}`}>
        <div className="logo">
          <img 
            src="https://png.pngtree.com/png-vector/20220419/ourmid/pngtree-vector-template-for-innovative-jh-letter-logo-design-with-linked-initials-vector-png-image_30077126.png"
            alt="James Holiday Inc Logo" 
            className="logo-image"
          />
          <span className="company-name">James Holiday Inc.</span>
        </div>
        <ul className="nav-links">
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/rooms">Rooms</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </nav>

      <div className="booking-container">
        <div className="booking-content">
          <div className="booking-header">
            <h1>Complete Your Booking</h1>
            <p>Please fill in your details to proceed with the reservation</p>
          </div>

          <form onSubmit={handleSubmit} className="booking-form">
            {/* Room Details Section */}
            <div className="form-section">
              <h2>Room Details</h2>
              <div className="form-row">
                <div className="input-group">
                  <label htmlFor="roomType">Room Type</label>
                  <select
                    id="roomType"
                    name="roomType"
                    value={formData.roomType}
                    onChange={handleChange}
                  >
                    <option value="Deluxe">Deluxe Room</option>
                    <option value="Suite">Luxury Suite</option>
                    <option value="Presidential">Presidential Suite</option>
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="guests">Number of Guests</label>
                  <select
                    id="guests"
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                  >
                    {[1, 2, 3, 4].map(num => (
                      <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="input-group">
                  <label htmlFor="checkIn">Check-in Date</label>
                  <input
                    type="date"
                    id="checkIn"
                    name="checkIn"
                    value={formData.checkIn}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                  {errors.checkIn && <span className="error-message-bf">{errors.checkIn}</span>}
                </div>

                <div className="input-group">
                  <label htmlFor="checkOut">Check-out Date</label>
                  <input
                    type="date"
                    id="checkOut"
                    name="checkOut"
                    value={formData.checkOut}
                    onChange={handleChange}
                    min={formData.checkIn || new Date().toISOString().split('T')[0]}
                    required
                  />
                  {errors.checkOut && <span className="error-message-bf">{errors.checkOut}</span>}
                </div>
              </div>
            </div>

            {/* Guest Details Section */}
            <div className="form-section">
              <h2>Guest Details</h2>
              <div className="form-row">
                <div className="input-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                  {errors.name && <span className="error-message-bf">{errors.name}</span>}
                </div>

                <div className="input-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                  {errors.email && <span className="error-message-bf">{errors.email}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="input-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    required
                  />
                  {errors.phone && <span className="error-message-bf">{errors.phone}</span>}
                </div>

                <div className="input-group">
                  <label htmlFor="specialRequests">Special Requests (Optional)</label>
                  <textarea
                    id="specialRequests"
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleChange}
                    placeholder="Any special requests or requirements?"
                  />
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">Proceed to Payment</button>
              <Link to="/rooms" className="cancel-btn">Cancel Booking</Link>
            </div>
          </form>
        </div>

        {/* Booking Summary */}
        <div className="booking-summary">
          <h2>Booking Summary</h2>
          <div className="summary-content">
            <div className="summary-item">
              <span>Room Type</span>
              <span>{formData.roomType}</span>
            </div>
            <div className="summary-item">
              <span>Number of Guests</span>
              <span>{formData.guests}</span>
            </div>
            {formData.checkIn && (
              <div className="summary-item">
                <span>Check-in</span>
                <span>{new Date(formData.checkIn).toLocaleDateString()}</span>
              </div>
            )}
            {formData.checkOut && (
              <div className="summary-item">
                <span>Check-out</span>
                <span>{new Date(formData.checkOut).toLocaleDateString()}</span>
              </div>
            )}
            <div className="price-summary">
              <div className="summary-item">
                <span>Room Rate</span>
                <span>$200/night</span>
              </div>
              <div className="summary-item">
                <span>Taxes & Fees</span>
                <span>$40</span>
              </div>
              <div className="summary-item total">
                <span>Total</span>
                <span>$240</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingForm;