import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('smartbank_user');
    const token = localStorage.getItem('smartbank_token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    const { token, ...userData } = res.data;
    localStorage.setItem('smartbank_token', token);
    localStorage.setItem('smartbank_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (fullName, email, phone, password) => {
    return await API.post('/auth/register', { fullName, email, phone, password });
  };

  const logout = () => {
    localStorage.removeItem('smartbank_token');
    localStorage.removeItem('smartbank_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
