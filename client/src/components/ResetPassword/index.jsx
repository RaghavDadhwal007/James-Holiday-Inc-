import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './resetPassword.css';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState({ type: '', content: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false
  });

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return password.length >= minLength && hasUpperCase && hasLowerCase && 
           hasNumbers && hasSpecialChar;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setMessage({ type: '', content: '' });
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validatePassword(formData.password)) {
      setMessage({
        type: 'error',
        content: 'Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.'
      });
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage({
        type: 'error',
        content: 'Passwords do not match!'
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URI}/users/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: formData.password }),
      });

      const result = await response.json();
      
      if (response.ok) {
        setMessage({
          type: 'success',
          content: 'Password reset successful! Redirecting to login...'
        });
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setMessage({
          type: 'error',
          content: result.message || 'Password reset failed. Please try again.'
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        content: 'An error occurred during password reset.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-box">
        <div className="reset-password-header">
          <h1>Reset Password</h1>
          <p>Enter your new password below</p>
        </div>

        <form onSubmit={handleSubmit} className="reset-password-form">
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <div className="password-input">
              <input
                type={showPassword.password ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your new password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => togglePasswordVisibility('password')}
              >
                {showPassword.password ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-input">
              <input
                type={showPassword.confirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm your new password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => togglePasswordVisibility('confirmPassword')}
              >
                {showPassword.confirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {message.content && (
            <div className={`message ${message.type}`}>
              {message.content}
            </div>
          )}

          <div className="password-requirements">
            <h4>Password Requirements:</h4>
            <ul>
              <li>At least 8 characters long</li>
              <li>Include uppercase & lowercase letters</li>
              <li>Include numbers</li>
              <li>Include special characters</li>
            </ul>
          </div>

          <button 
            type="submit" 
            className={`submit-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Resetting Password...' : 'Reset Password'}
          </button>

          <div className="form-footer">
            <Link to="/login" className="back-to-login">
              ← Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
