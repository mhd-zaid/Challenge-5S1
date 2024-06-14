import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';
import AuthService from '@/services/AuthService';

const AuthGuard = () => {
  const { token, setUser, logout } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (token) {
          const response = await AuthService.me(token);
          if (response.status === 200) {
            const user = await response.json();
            setUser(user);
          } else {
            logout();
            setUser(null);
          }
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération de l'utilisateur:",
          error,
        );
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, setUser]);

  if (loading) {
    return <div>Chargement...</div>;
  }
  return token && !loading ? <Outlet /> : <Navigate to="/auth/login" replace />;
};

export default AuthGuard;
