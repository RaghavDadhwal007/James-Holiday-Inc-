import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from './auth';

const PrivateRoute = ({ redirectPath = '/login' }) => {
  if (!isAuthenticated()) {
    return <Navigate to={redirectPath} />;
  }

  return <Outlet />;
};

export default PrivateRoute;