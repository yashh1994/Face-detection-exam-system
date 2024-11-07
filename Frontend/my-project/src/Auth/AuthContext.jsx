// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(() => {
    const storedAuth = localStorage.getItem('auth');
    return storedAuth ? JSON.parse(storedAuth) : null;
  });

  const login = (authData) => {
    setAuthToken(authData);
    localStorage.setItem('auth', JSON.stringify(authData));
  };

  const logout = () => {
    setAuthToken(null);
    localStorage.removeItem('auth');
  };

  useEffect(() => {
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      setAuthToken(JSON.parse(storedAuth));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ authToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
