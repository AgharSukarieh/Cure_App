// Custom Hook for Authentication
import { useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

/**
 * Custom hook for authentication management
 * @returns {Object} Authentication state and methods
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  /**
   * Check current authentication status
   */
  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const isAuth = await authService.isAuthenticated();
      const userData = await authService.getCurrentUser();
      
      setIsAuthenticated(isAuth);
      setUser(userData);
    } catch (error) {
      console.error('Auth check error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Login result
   */
  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await authService.login(email, password);
      
      if (result.success) {
        setUser(result.data.user);
        setIsAuthenticated(true);
      } else {
        setError(result.message);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'خطأ في تسجيل الدخول';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Register user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Registration result
   */
  const register = useCallback(async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await authService.register(userData);
      
      if (!result.success) {
        setError(result.message);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'خطأ في إنشاء الحساب';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Logout user
   * @returns {Promise<Object>} Logout result
   */
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await authService.logout();
      
      setUser(null);
      setIsAuthenticated(false);
      
      return result;
    } catch (error) {
      const errorMessage = 'خطأ في تسجيل الخروج';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Delete user account
   * @returns {Promise<Object>} Delete account result
   */
  const deleteAccount = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await authService.deleteAccount();
      
      if (result.success) {
        setUser(null);
        setIsAuthenticated(false);
      } else {
        setError(result.message);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'خطأ في حذف الحساب';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update user profile
   * @param {Object} profileData - Profile data to update
   * @returns {Promise<Object>} Update result
   */
  const updateProfile = useCallback(async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await authService.updateProfile(profileData);
      
      if (result.success) {
        setUser(result.data);
      } else {
        setError(result.message);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'خطأ في تحديث الملف الشخصي';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Change password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Change password result
   */
  const changePassword = useCallback(async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await authService.changePassword(currentPassword, newPassword);
      
      if (!result.success) {
        setError(result.message);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'خطأ في تغيير كلمة المرور';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Refresh authentication
   */
  const refreshAuth = useCallback(async () => {
    await checkAuthStatus();
  }, []);

  return {
    // State
    user,
    isAuthenticated,
    loading,
    error,
    
    // Methods
    login,
    register,
    logout,
    deleteAccount,
    updateProfile,
    changePassword,
    clearError,
    refreshAuth,
    checkAuthStatus
  };
};
