import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./userProfile.css";
import Header from "../Header";
import Footer from "../Footer";

const UserProfile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    isAdmin: false,
    isVerified: false,
    createdAt: "",
  });

  const [editedData, setEditedData] = useState(userData);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          `${process.env.REACT_APP_SERVER_URI}/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch user data");

        const data = await response.json();
        setUserData(data);
        setEditedData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URI}/users/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editedData),
        }
      );

      if (!response.ok) throw new Error("Failed to update profile");

      const updatedData = await response.json();
      setUserData(updatedData);
      setIsEditing(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="up-loading">
        <div className="up-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="up-container">
        <div className="up-content">
          <aside className="up-sidebar">
            <div className="up-profile-header">
              <div className="up-avatar">
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${userData.name}`}
                  alt={userData.name}
                />
                {userData.isVerified && (
                  <span className="up-verified-badge" title="Verified Account">
                    ✓
                  </span>
                )}
              </div>
              <h2>{userData.name}</h2>
              <p className="up-member-since">
                Member since {formatDate(userData.createdAt)}
              </p>
              {userData.isAdmin && (
                <span className="up-admin-badge">Admin</span>
              )}
            </div>

            <nav className="up-nav">
              <Link to="/bookings" className="up-nav-link">
                <span className="up-nav-icon">📅</span>
                My Bookings
              </Link>
              <Link to="/favorites" className="up-nav-link">
                <span className="up-nav-icon">❤️</span>
                Saved Rooms
              </Link>
              <Link to="/settings" className="up-nav-link">
                <span className="up-nav-icon">⚙️</span>
                Settings
              </Link>
            </nav>
          </aside>

          <main className="up-main">
            <div className="up-header">
              <div>
                <h1>My Profile</h1>
                <p>Manage your personal information</p>
              </div>
              {!isEditing ? (
                <button
                  className="up-edit-btn"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              ) : (
                <div className="up-edit-actions">
                  <button className="up-save-btn" onClick={handleSubmit}>
                    Save Changes
                  </button>
                  <button
                    className="up-cancel-btn"
                    onClick={() => {
                      setEditedData(userData);
                      setIsEditing(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {error && <div className="up-error">{error}</div>}

            <form className="up-form" onSubmit={handleSubmit}>
              <div className="up-form-grid">
                <div className="up-form-group">
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
                    <p className="up-info">{userData.name}</p>
                  )}
                </div>

                <div className="up-form-group">
                  <label>Email Address</label>
                  <p className="up-info">
                    {userData.email}
                    {userData.isVerified && (
                      <span className="up-verified-tag">Verified</span>
                    )}
                  </p>
                </div>

                <div className="up-form-group">
                  <label>Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={editedData.phone}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="up-info">
                      {userData.phone || "Not provided"}
                    </p>
                  )}
                </div>
              </div>

              <div className="up-security">
                <h3>Security Settings</h3>
                <div className="up-form-group">
                  <label>Password</label>
                  <Link to="/change-password" className="up-change-password">
                    Change Password
                  </Link>
                </div>
              </div>

              {userData.isAdmin && (
                <div className="up-admin-section">
                  <h3>Admin Access</h3>
                  <Link to="/admin" className="up-admin-link">
                    Go to Admin Dashboard
                  </Link>
                </div>
              )}

              <div className="up-danger-zone">
                <h3>Danger Zone</h3>
                <p>
                  Once you delete your account, there is no going back. Please
                  be certain.
                </p>
                <button type="button" className="up-delete-btn">
                  Delete Account
                </button>
              </div>
            </form>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserProfile;
