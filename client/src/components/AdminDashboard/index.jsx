import React, { useState } from 'react';
import './adminDashboard.css';

const AdminDashboard = () => {
 const [activeSection, setActiveSection] = useState('dashboard');

 const dashboardData = {
   totalBookings: 1250,
   revenue: 158900,
   occupancyRate: 75,
   todayCheckins: 12,
   todayCheckouts: 15,
   recentBookings: [
     { id: 'B001', guest: 'John Doe', room: 'Deluxe Suite', checkIn: '2024-02-20', status: 'Confirmed' },
     { id: 'B002', guest: 'Jane Smith', room: 'Executive Suite', checkIn: '2024-02-21', status: 'Pending' },
     { id: 'B003', guest: 'Mike Johnson', room: 'Premium Room', checkIn: '2024-02-22', status: 'Confirmed' }
   ]
 };

 // Management Components
 const RoomManagement = () => (
   <div className="admin-management-section">
     <h2>Room Management</h2>
     {/* Room management content */}
   </div>
 );

 const BookingManagement = () => (
   <div className="admin-management-section">
     <h2>Booking Management</h2>
     {/* Booking management content */}
   </div>
 );

 const UserManagement = () => (
   <div className="admin-management-section">
     <h2>User Management</h2>
     {/* User management content */}
   </div>
 );

 const PaymentManagement = () => (
   <div className="admin-management-section">
     <h2>Payment Management</h2>
     {/* Payment management content */}
   </div>
 );

 const Sidebar = () => (
   <div className="admin-dash-sidebar">
     <div className="admin-dash-logo">
       <h2>Admin Panel</h2>
     </div>
     
     <nav className="admin-dash-nav">
       <button 
         className={`admin-nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
         onClick={() => setActiveSection('dashboard')}
       >
         <span className="admin-nav-icon">📊</span>
         <span>Dashboard</span>
       </button>
       
       <button 
         className={`admin-nav-item ${activeSection === 'rooms' ? 'active' : ''}`}
         onClick={() => setActiveSection('rooms')}
       >
         <span className="admin-nav-icon">🏨</span>
         <span>Room Management</span>
       </button>
       
       <button 
         className={`admin-nav-item ${activeSection === 'bookings' ? 'active' : ''}`}
         onClick={() => setActiveSection('bookings')}
       >
         <span className="admin-nav-icon">📅</span>
         <span>Bookings</span>
       </button>
       
       <button 
         className={`admin-nav-item ${activeSection === 'users' ? 'active' : ''}`}
         onClick={() => setActiveSection('users')}
       >
         <span className="admin-nav-icon">👥</span>
         <span>Users</span>
       </button>
       
       <button 
         className={`admin-nav-item ${activeSection === 'payments' ? 'active' : ''}`}
         onClick={() => setActiveSection('payments')}
       >
         <span className="admin-nav-icon">💰</span>
         <span>Payments</span>
       </button>
     </nav>
   </div>
 );

 const Header = () => (
   <header className="admin-dash-header">
     <div className="admin-search">
       <input type="search" placeholder="Search..." />
     </div>
     
     <div className="admin-header-actions">
       <button className="admin-notif-btn">
         🔔
         <span className="admin-notif-badge">3</span>
       </button>
       <div className="admin-profile-section">
         <img src="/api/placeholder/40/40" alt="Admin" />
         <span>Admin Name</span>
       </div>
     </div>
   </header>
 );

 const DashboardOverview = () => (
   <div className="admin-dashboard-overview">
     <div className="admin-stats-grid">
       <div className="admin-stat-card">
         <div className="admin-stat-icon" style={{ background: '#e3f2fd' }}>📊</div>
         <div className="admin-stat-details">
           <h3>Total Bookings</h3>
           <p className="admin-stat-value">{dashboardData.totalBookings}</p>
           <span className="admin-stat-change positive">+12.5% from last month</span>
         </div>
       </div>

       <div className="admin-stat-card">
         <div className="admin-stat-icon" style={{ background: '#e8f5e9' }}>💰</div>
         <div className="admin-stat-details">
           <h3>Revenue</h3>
           <p className="admin-stat-value">${dashboardData.revenue.toLocaleString()}</p>
           <span className="admin-stat-change positive">+8.2% from last month</span>
         </div>
       </div>

       <div className="admin-stat-card">
         <div className="admin-stat-icon" style={{ background: '#fff3e0' }}>🏨</div>
         <div className="admin-stat-details">
           <h3>Occupancy Rate</h3>
           <p className="admin-stat-value">{dashboardData.occupancyRate}%</p>
           <span className="admin-stat-change negative">-2.3% from last month</span>
         </div>
       </div>

       <div className="admin-stat-card">
         <div className="admin-stat-icon" style={{ background: '#f3e5f5' }}>🔄</div>
         <div className="admin-stat-details">
           <h3>Today's Activity</h3>
           <p className="admin-stat-value">
             {dashboardData.todayCheckins} Check-ins | {dashboardData.todayCheckouts} Check-outs
           </p>
         </div>
       </div>
     </div>

     <div className="admin-bookings">
       <div className="admin-section-header">
         <h2>Recent Bookings</h2>
         <button className="admin-view-btn">View All</button>
       </div>
       
       <div className="admin-table-container">
         <table className="admin-table">
           <thead>
             <tr>
               <th>Booking ID</th>
               <th>Guest Name</th>
               <th>Room</th>
               <th>Check-in Date</th>
               <th>Status</th>
               <th>Actions</th>
             </tr>
           </thead>
           <tbody>
             {dashboardData.recentBookings.map(booking => (
               <tr key={booking.id}>
                 <td>{booking.id}</td>
                 <td>{booking.guest}</td>
                 <td>{booking.room}</td>
                 <td>{booking.checkIn}</td>
                 <td>
                   <span className={`admin-status-badge ${booking.status.toLowerCase()}`}>
                     {booking.status}
                   </span>
                 </td>
                 <td>
                   <button className="admin-action-btn">View Details</button>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>
     </div>

     <div className="admin-quick-actions">
       <h2>Quick Actions</h2>
       <div className="admin-actions-grid">
         <button className="admin-action-btn">
           <span className="admin-action-icon">➕</span>
           <span>Add New Room</span>
         </button>
         <button className="admin-action-btn">
           <span className="admin-action-icon">📝</span>
           <span>New Booking</span>
         </button>
         <button className="admin-action-btn">
           <span className="admin-action-icon">👤</span>
           <span>Add User</span>
         </button>
         <button className="admin-action-btn">
           <span className="admin-action-icon">📊</span>
           <span>Generate Report</span>
         </button>
       </div>
     </div>
   </div>
 );

 const renderContent = () => {
   switch(activeSection) {
     case 'dashboard':
       return <DashboardOverview />;
     case 'rooms':
       return <RoomManagement />;
     case 'bookings':
       return <BookingManagement />;
     case 'users':
       return <UserManagement />;
     case 'payments':
       return <PaymentManagement />;
     default:
       return <DashboardOverview />;
   }
 };

 return (
   <div className="admin-dashboard">
     <Sidebar />
     <main className="admin-dash-main">
       <Header />
       <div className="admin-dash-content">
         {renderContent()}
       </div>
     </main>
   </div>
 );
};

export default AdminDashboard;