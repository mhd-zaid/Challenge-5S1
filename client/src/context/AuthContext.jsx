import { createContext, useContext, useState, useEffect } from 'react';
import AuthService from '@/services/AuthService';

export const AuthContext = createContext({
  user: null,
  setUser: () => {},
  token: null,
  login: () => {},
  logout: () => {},
  authLoading: true,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (token) {
          const response = await AuthService.me(token);
          if (response.status === 200) {
            const user = await response.json();
            setUser(user);
            localStorage.setItem('token', token);
            setAuthLoading(false);
          } else {
            logout();
          }
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération de l'utilisateur:",
          error,
        );
        logout();
      }
    };

    fetchData();
  }, [token]);

  const login = authToken => {
    setAuthLoading(true);
    setToken(authToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setAuthLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, token, login, logout, authLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
