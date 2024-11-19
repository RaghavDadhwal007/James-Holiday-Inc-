import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';
import ForgotPassword from "./components/ForgotPassword";
import UserVerification from './components/UserVerification';
import ResetPassword from './components/ResetPassword';
import UserProfile from './components/UserProfile';
import HomePage from './components/HomePage';
import MyBookings from './components/MyBookings';
import RoomsList from './components/RoomsList';
import RoomDetails from './components/RoomDetails';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminRoomManagement from './components/admin/AdminRoomManagement/AdminRoomManagement';
import AdminUserManagement from './components/admin/AdminUserManagement/AdminUserManagement';
import AdminBookingManagement from './components/admin/AdminBookingManagement/AdminBookingManagement';
import Success from './components/success';
import CheckIn from './components/checkIn';
import PrivateRoute from './privateRoute';

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
          <Route path="/roomsList" element={<RoomsList />} />
          <Route path="/roomDetails/:id" element={<RoomDetails />} />
          <Route path="/checkin/:id" element={<CheckIn />} />
          
          <Route element={<PrivateRoute />}>
          <Route path="/myBookings" element={<MyBookings />} />
            <Route path="/userprofile" element={<UserProfile />} />
            
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/rooms" element={<AdminRoomManagement />} />    
            <Route path="/admin/users" element={<AdminUserManagement />} />  
              
            <Route path="/admin/bookings" element={<AdminBookingManagement />} />
          </Route>

          <Route path="/success" element={<Success />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
