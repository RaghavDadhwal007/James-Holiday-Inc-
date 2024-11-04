import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './userProfile.css';

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Sample user data - Replace with actual user data
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'johndoe@example.com',
    phone: '+1 234 567 8900',
    address: '123 Main Street',
    city: 'New York',
    country: 'United States',
    password: '********',
    image: '/api/placeholder/150/150'  // Replace with actual user image
  });

  const [editedData, setEditedData] = useState(userData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Add your API call here to update user data
      setUserData(editedData);
      setIsEditing(false);
      // Show success message
    } catch (error) {
      // Handle error
      console.error('Error updating profile:', error);
    }
  };

  const handleCancel = () => {
    setEditedData(userData);
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        <p>Manage your personal information</p>
      </div>

      <div className="profile-content">
        <div className="profile-sidebar">
          <div className="profile-image-section">
            <div className="profile-image">
              <img src={userData.image} alt={userData.name} />
              {isEditing && (
                <button className="change-photo-btn">
                  Change Photo
                </button>
              )}
            </div>
            <h2>{userData.name}</h2>
            <p className="member-since">Member since Jan 2024</p>
          </div>

          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-icon">🏨</span>
              <div className="stat-info">
                <h3>12</h3>
                <p>Total Bookings</p>
              </div>
            </div>
            <div className="stat-item">
              <span className="stat-icon">⭐</span>
              <div className="stat-info">
                <h3>4.8</h3>
                <p>Average Rating</p>
              </div>
            </div>
          </div>

          <div className="quick-links">
            <Link to="/mybookings" className="quick-link">
              <span>📅</span> My Bookings
            </Link>
            <Link to="/favorites" className="quick-link">
              <span>❤️</span> Saved Rooms
            </Link>
            <Link to="/reviews" className="quick-link">
              <span>⭐</span> My Reviews
            </Link>
          </div>
        </div>

        <div className="profile-details">
          <div className="section-header">
            <h2>Personal Information</h2>
            {!isEditing ? (
              <button 
                className="edit-button"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            ) : (
              <div className="edit-actions">
                <button 
                  className="save-button"
                  onClick={handleSubmit}
                >
                  Save Changes
                </button>
                <button 
                  className="cancel-button"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={editedData.name}
                    onChange={handleInputChange}
                    required
                  />
                ) : (
                  <p className="info-text">{userData.name}</p>
                )}
              </div>

              <div className="form-group">
                <label>Email Address</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editedData.email}
                    onChange={handleInputChange}
                    required
                  />
                ) : (
                  <p className="info-text">{userData.email}</p>
                )}
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={editedData.phone}
                    onChange={handleInputChange}
                    required
                  />
                ) : (
                  <p className="info-text">{userData.phone}</p>
                )}
              </div>

              <div className="form-group">
                <label>Address</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={editedData.address}
                    onChange={handleInputChange}
                    required
                  />
                ) : (
                  <p className="info-text">{userData.address}</p>
                )}
              </div>

              <div className="form-group">
                <label>City</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="city"
                    value={editedData.city}
                    onChange={handleInputChange}
                    required
                  />
                ) : (
                  <p className="info-text">{userData.city}</p>
                )}
              </div>

              <div className="form-group">
                <label>Country</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="country"
                    value={editedData.country}
                    onChange={handleInputChange}
                    required
                  />
                ) : (
                  <p className="info-text">{userData.country}</p>
                )}
              </div>
            </div>

            <div className="security-section">
              <h3>Security Settings</h3>
              <div className="form-group">
                <label>Password</label>
                <div className="password-field">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={userData.password}
                    readOnly
                  />
                  <button 
                    type="button" 
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                <Link to="/reset-password" className="change-password-link">
                  Change Password
                </Link>
              </div>
            </div>
          </form>

          <div className="danger-zone">
            <h3>Danger Zone</h3>
            <p>Once you delete your account, there is no going back. Please be certain.</p>
            <button className="delete-account-btn">Delete Account</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
