import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import axios from 'axios';

const AuthGuard = ({ component: Component }) => {
  const { token, setUser, logout } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (token) {
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}api/me`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          console.log('response:', response);
          if (response.status === 200) {
            const user =  response.data;
            setUser(user); 
          } else {
            console.log('Token invalide')
            logout();
            setUser(null); 
          }
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
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
  return token && !loading ? <Component /> : <Navigate to="/auth/login" replace />;
};

export default AuthGuard;