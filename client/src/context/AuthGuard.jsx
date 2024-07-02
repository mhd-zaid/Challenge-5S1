import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import NotFoundPage from '@/pages/NotFoundPage.jsx';

const AuthGuard = ({ children, roles, hasPublicAccess = false }) => {
  const { user } = useAuth();

  if (!user) {
    if(hasPublicAccess) {
      return children;
    }
    return <NotFoundPage />;
  }

  if (!roles.includes(user.roles[0])) {
    return <NotFoundPage />
  }

  return children;
};

export default AuthGuard;
