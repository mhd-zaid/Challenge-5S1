import { createContext, useContext, useState, useEffect } from 'react';
import AuthService from '@/services/AuthService';

export const AuthContext = createContext({
  user: null,
  setUser: () => {},
  token: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  console.log(user);

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
      }
    };

    fetchData();
  }, [token]);

  const login = authToken => {
    setToken(authToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
