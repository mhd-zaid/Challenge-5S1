import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const AuthGuard = ({ component: Component }) => {
  const { token } = useAuth();
  return token ? <Component /> : <Navigate to="/auth/login" replace />;
};

export default AuthGuard;
