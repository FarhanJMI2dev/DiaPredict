import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('dia_user');
      const token = localStorage.getItem('dia_token');
      if (savedUser && token) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error('Failed to parse saved user:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const loginUser = async (email, password) => {
    const data = await apiLogin(email, password);
    setUser(data.user);
    return data;
  };

  const registerUser = async (formData) => {
    const data = await apiRegister(formData);
    setUser(data.user);
    return data;
  };

  const logoutUser = () => {
    apiLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login: loginUser,
        register: registerUser,
        logout: logoutUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
