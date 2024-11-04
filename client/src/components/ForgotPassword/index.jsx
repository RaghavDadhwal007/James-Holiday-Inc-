import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./forgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URI}/users/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      if (response.ok) {
        setStatus({
          type: "success",
          message: "Reset link has been sent to your email address."
        });
        setEmail("");
      } else {
        setStatus({
          type: "error",
          message: result.message || "Failed to send reset link"
        });
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: "An error occurred. Please try again later."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-box">
        <div className="forgot-left">
          <div className="overlay"></div>
          <div className="welcome-content">
            <h2>Password Recovery</h2>
            <p>Don't worry, we've got you covered</p>
            <div className="benefits">
              <div className="benefit-item">✓ Quick and secure process</div>
              <div className="benefit-item">✓ Email verification</div>
              <div className="benefit-item">✓ 24/7 support available</div>
            </div>
          </div>
        </div>

        <div className="forgot-right">
          <div className="forgot-header">
            <h1>Forgot Password?</h1>
            <p>Enter your email to reset your password</p>
          </div>

          <form onSubmit={handleSubmit} className="forgot-form">
            {status.message && (
              <div className={`status-message ${status.type}`}>
                {status.message}
              </div>
            )}

            <div className="input-group">
              <div className="input-wrapper">
                <span className="input-icon">📧</span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className={`submit-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <div className="form-footer">
              <p>
                <Link to="/login" className="back-to-login">
                  ← Back to Login
                </Link>
              </p>
              <p className="help-text">
                Need help? <Link to="/contact">Contact Support</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;