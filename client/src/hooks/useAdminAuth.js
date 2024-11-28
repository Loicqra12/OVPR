import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useAdminAuth = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const response = await fetch('/api/admin/verify', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
        localStorage.removeItem('adminToken');
      }
    } catch (error) {
      console.error('Erreur de vérification admin:', error);
      setIsAdmin(false);
      localStorage.removeItem('adminToken');
    } finally {
      setLoading(false);
    }
  };

  const loginAdmin = async (email, password) => {
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la connexion');
      }

      localStorage.setItem('adminToken', data.token);
      setIsAdmin(true);
      navigate('/admin/dashboard');
      return true;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw error;
    }
  };

  const logoutAdmin = () => {
    localStorage.removeItem('adminToken');
    setIsAdmin(false);
    navigate('/admin/login');
  };

  return {
    isAdmin,
    loading,
    loginAdmin,
    logoutAdmin,
    checkAdminAuth,
  };
};

export default useAdminAuth;
