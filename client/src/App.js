import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';
import ForgotPassword from "./components/ForgotPassword";
import UserVerification from './components/UserVerification';
import ResetPassword from './components/ResetPassword';
import UserProfile from './components/UserProfile';
import HomePage from './components/HomePage';
import BookingForm from './components/BookingForm';
import MyBookings from './components/MyBookings';
import RoomsList from './components/RoomsList';
import RoomDetails from './components/RoomDetails';

import AdminDashboard from './components/AdminDashboard';
import AdminRoomManagement from './components/admin/AdminRoomManagement/AdminRoomManagement';
import AdminUserManagement from './components/admin/AdminUserManagement/AdminUserManagement';

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify/:token" element={<UserVerification />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route path="/" element={<HomePage />} />
          <Route path="/bookingForm" element={<BookingForm />} />
          <Route path="/myBookings" element={<MyBookings />} />
          <Route path="/roomsList" element={<RoomsList />} />
          <Route path="/roomDetails/:id" element={<RoomDetails />} />
          
          <PrivateRoute>
            <Route path="/userprofile" element={<UserProfile />} />
            
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/rooms" element={<AdminRoomManagement />} />    
            <Route path="/admin/users" element={<AdminUserManagement />} />  
          </PrivateRoute>

        </Routes>
      </div>
    </Router>
  );
}

export default App;
