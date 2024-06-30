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
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      try {
        if (token) {
          const response = await AuthService.me(token, signal);
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
        if (error.name === 'AbortError') {
          console.info('Fetch aborted');
        }
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [token]);

  const login = authToken => {
    setAuthLoading(true);
    setToken(authToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    setUser(null);
    setAuthLoading(false);
  };

  const isAdministrator = user ? user.roles.includes('ROLE_ADMIN') : false;

  const isPrestataire = user ? user.roles.includes('ROLE_PRESTA') : false;

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        login,
        logout,
        authLoading,
        isAdministrator,
        isPrestataire,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
