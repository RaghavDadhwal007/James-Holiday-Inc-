import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import "./adminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenuItem, setActiveMenuItem] = useState("overview");

  useEffect(() => {
    // Extract the current route section from the URL
    const path = location.pathname.split("/")[2] || "overview";
    setActiveMenuItem(path);

    // Check for authentication
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [location.pathname, navigate]);

  const menuItems = [
    { id: "overview", label: "Dashboard", icon: "📊" },
    { id: "bookings", label: "Bookings", icon: "📅" },
    { id: "rooms", label: "Rooms", icon: "🏨" },
    { id: "users", label: "Users", icon: "👥" },
  ];

  const handleMenuClick = (menuId) => {
    if (menuId === "overview") {
      navigate("/admin");
    } else {
      navigate(`/admin/${menuId}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Function to get the current page title
  const getCurrentPageTitle = () => {
    const currentMenuItem = menuItems.find(
      (item) => item.id === activeMenuItem
    );
    return currentMenuItem ? currentMenuItem.label : "Dashboard";
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <img
            src="https://png.pngtree.com/png-vector/20220419/ourmid/pngtree-vector-template-for-innovative-jh-letter-logo-design-with-linked-initials-vector-png-image_30077126.png"
            alt="Logo"
            className="logo"
          />
          <h2>Admin Panel</h2>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`menu-item ${
                activeMenuItem === item.id ? "active" : ""
              }`}
              onClick={() => handleMenuClick(item.id)}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <span className="menu-icon">🚪</span>
            <span className="menu-label">Logout</span>
          </button>
        </div>
      </div>

      <div className="dashboard-main">
        <header className="dashboard-header">
          <h1 className="page-title">{getCurrentPageTitle()}</h1>

          <div className="header-actions">
            <div className="admin-profile">
              <span className="admin-name">Admin</span>
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          {activeMenuItem === "overview" ? (
            <div className="welcome-section">
              <h2>Welcome to Admin Dashboard</h2>
              <p>
                Select an option from the sidebar to manage your hotel system.
              </p>
            </div>
          ) : (
            <Outlet />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
