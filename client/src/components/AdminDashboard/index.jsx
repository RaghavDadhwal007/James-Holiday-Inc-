import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import './adminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenuItem, setActiveMenuItem] = useState('overview');
  const [dashboardStats, setDashboardStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalRooms: 0,
    recentBookings: [],
    occupancyRate: 0
  });

  useEffect(() => {
    const path = location.pathname.split('/')[2] || 'overview';
    setActiveMenuItem(path);
    fetchDashboardStats();
  }, [location.pathname]);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_SERVER_URI}/admin/dashboard-stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setDashboardStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'bookings', label: 'Bookings', icon: '📅' },
    { id: 'rooms', label: 'Rooms', icon: '🏨' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'reports', label: 'Reports', icon: '📈' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  const handleMenuClick = (menuId) => {
    if (menuId === 'overview') {
      navigate('/admin');
    } else {
      navigate(`/admin/${menuId}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const DashboardOverview = () => (
    <div className="dashboard-overview">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#e3f2fd' }}>📊</div>
          <div className="stat-details">
            <h3>Total Bookings</h3>
            <p className="stat-value">{dashboardStats.totalBookings}</p>
            <span className="stat-change positive">+12.5% from last month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#e8f5e9' }}>💰</div>
          <div className="stat-details">
            <h3>Revenue</h3>
            <p className="stat-value">${dashboardStats.totalRevenue.toLocaleString()}</p>
            <span className="stat-change positive">+8.2% from last month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fff3e0' }}>👥</div>
          <div className="stat-details">
            <h3>Total Users</h3>
            <p className="stat-value">{dashboardStats.totalUsers}</p>
            <span className="stat-change positive">+15.3% from last month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#f3e5f5' }}>🏨</div>
          <div className="stat-details">
            <h3>Occupancy Rate</h3>
            <p className="stat-value">{dashboardStats.occupancyRate}%</p>
            <span className="stat-change negative">-2.3% from last month</span>
          </div>
        </div>
      </div>

      <div className="recent-activities">
        <div className="section-header">
          <h2>Recent Bookings</h2>
          <button onClick={() => navigate('/admin/bookings')} className="view-all-btn">
            View All
          </button>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Guest</th>
                <th>Room</th>
                <th>Check-in</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {dashboardStats.recentBookings.map((booking) => (
                <tr key={booking._id}>
                  <td>{booking._id}</td>
                  <td>{booking.user.name}</td>
                  <td>{booking.room.type}</td>
                  <td>{new Date(booking.checkIn).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge ${booking.status.toLowerCase()}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td>${booking.totalAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="quick-actions">
        <div className="section-header">
          <h2>Quick Actions</h2>
        </div>
        <div className="actions-grid">
          <button onClick={() => navigate('/admin/rooms/add')} className="action-btn">
            <span className="action-icon">➕</span>
            <span>Add New Room</span>
          </button>
          <button onClick={() => navigate('/admin/bookings/create')} className="action-btn">
            <span className="action-icon">📝</span>
            <span>New Booking</span>
          </button>
          <button onClick={() => navigate('/admin/users/add')} className="action-btn">
            <span className="action-icon">👤</span>
            <span>Add User</span>
          </button>
          <button onClick={() => navigate('/admin/reports/generate')} className="action-btn">
            <span className="action-icon">📊</span>
            <span>Generate Report</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="admin-dashboard">
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <img 
            src="/api/placeholder/40/40"
            alt="Logo" 
            className="logo"
          />
          <h2>Admin Panel</h2>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`menu-item ${activeMenuItem === item.id ? 'active' : ''}`}
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
          <div className="search-bar">
            <input type="search" placeholder="Search..." />
          </div>
          
          <div className="header-actions">
            <button className="notifications-btn">
              🔔
              <span className="notification-badge">3</span>
            </button>
            
            <div className="admin-profile">
              <img 
                src="/api/placeholder/40/40" 
                alt="Admin" 
                className="profile-image"
              />
              <span className="admin-name">Admin User</span>
            </div>
          </div>
        </header>

        <main className="dashboard-content">
          {activeMenuItem === 'overview' ? <DashboardOverview /> : <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;