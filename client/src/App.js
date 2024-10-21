import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';
import ForgotPassword from "./components/ForgotPassword";
import UserVerification from './components/UserVerification';
import ResetPassword from './components/ResetPassword';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<RegistrationForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify/:token" element={<UserVerification />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
