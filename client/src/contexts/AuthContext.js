import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS, getAuthHeader, handleApiError } from '../config/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get(API_ENDPOINTS.AUTH.PROFILE, {
            headers: getAuthHeader()
          });
          
          if (response.data) {
            setUser(response.data);
          } else {
            localStorage.removeItem('token');
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Erreur de vérification d\'authentification:', error);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password
      });

      const { token, user: userData } = response.data;
      localStorage.setItem('token', token);
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return handleApiError(error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const register = async (userData) => {
    try {
      const response = await axios.post(API_ENDPOINTS.AUTH.REGISTER, userData);

      const { token, user: newUser } = response.data;
      localStorage.setItem('token', token);
      setUser(newUser);
      return { success: true };
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      return handleApiError(error);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put(API_ENDPOINTS.AUTH.UPDATE_PROFILE, profileData, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        }
      });

      const { user: updatedUser } = response.data;
      setUser(updatedUser);
      return { success: true };
    } catch (error) {
      console.error('Erreur de mise à jour du profil:', error);
      return handleApiError(error);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    updateProfile,
    setUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
