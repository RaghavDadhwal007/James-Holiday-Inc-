import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './registrationForm.css';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URI}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result.success) {
        navigate('/login');
      } else {
        setErrors({ submit: result.message || "Registration failed" });
      }
    } catch (error) {
      setErrors({ submit: "Network error occurred" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <div className="register-left">
          <div className="overlay"></div>
          <div className="welcome-content">
            <h2>Welcome to<br />James Holiday Inc.</h2>
            <p>Experience luxury and comfort</p>
            <div className="benefits">
              <div className="benefit-item">✓ Exclusive Offers</div>
              <div className="benefit-item">✓ Priority Booking</div>
              <div className="benefit-item">✓ Free Upgrades</div>
            </div>
          </div>
        </div>

        <div className="register-right">
          <h1>Create Account</h1>
          
          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-row">
              <div className="input-group">
                <div className="input-wrapper">
                  <span className="input-icon">👤</span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <div className="input-wrapper">
                  <span className="input-icon">📧</span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <div className="input-wrapper">
                  <span className="input-icon">📱</span>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="input-group full-width">
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                    required
                  />
                </div>
              </div>
            </div>

            {errors.submit && <div className="error-message">{errors.submit}</div>}

            <button 
              type="submit" 
              className={`register-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>

            <div className="login-link">
              Already have an account? <Link to="/login">Sign In</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;