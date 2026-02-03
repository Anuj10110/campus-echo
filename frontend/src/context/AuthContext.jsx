import React, { createContext, useState, useContext, useEffect } from 'react';
import apiService from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Try to refresh token
      const refreshResponse = await apiService.refreshToken();
      
      if (refreshResponse.success) {
        // Get user data
        const userResponse = await apiService.getCurrentUser();
        
        if (userResponse.success) {
          setUser(userResponse.data);
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      console.log('Not authenticated');
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await apiService.login(email, password);
      
      if (response.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true, data: response.data };
      }
      
      return { success: false, message: response.message };
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Login failed. Please try again.' 
      };
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      apiService.clearAccessToken();
    }
  };

  const registerStudent = async (userData) => {
    try {
      const response = await apiService.registerStudent(userData);
      return response;
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Registration failed. Please try again.',
        errors: error.errors 
      };
    }
  };

  const registerFaculty = async (userData) => {
    try {
      const response = await apiService.registerFaculty(userData);
      return response;
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Registration failed. Please try again.',
        errors: error.errors 
      };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    registerStudent,
    registerFaculty,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
