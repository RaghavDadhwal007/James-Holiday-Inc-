// PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from './auth';

const PrivateRoute = ({ children, redirectPath = '/login' }) => {
    if (!isAuthenticated()) {
      return <Navigate to={redirectPath} />;
    }
  
    return children;
  };
  
  export default PrivateRoute;