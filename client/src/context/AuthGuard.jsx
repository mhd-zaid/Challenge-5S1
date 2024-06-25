import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';
import AuthService from '@/services/AuthService';

const AuthGuard = () => {
  const { user } = useAuth();
  console.log(user);

  return user ? <Outlet /> : <Navigate to="/auth/login" replace />;
};

export default AuthGuard;
