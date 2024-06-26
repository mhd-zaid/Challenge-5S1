import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const login = (authToken) => {
    setToken(authToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  const isAdministrator = user ? user.roles.includes('ROLE_ADMIN') : false;

  const isPrestataire = user ? user.roles.includes('ROLE_PRESTA') : false;

  return (
    <AuthContext.Provider value={{ user, setUser, token, login, logout, isAdministrator, isPrestataire }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
