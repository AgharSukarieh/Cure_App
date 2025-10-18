// Authentication Service
import { apiRequest, tokenManager } from '../config/apiConfig';
import API from '../config/apiConfig';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
class AuthService {
  
  /**
   * User login
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Login response
   */
  async login(email, password) {
    try {
      console.log('🚀 Login Request:', {
        url: `${API.baseURL}${API.auth.login}`,
        fullUrl: `${API.baseURL}${API.auth.login}`,
        method: 'POST',
        data: { email, password }
      });
      
      const response = await apiRequest({
        method: 'POST',
        url: API.auth.login,
        data: {
          email,
          password
        }
      });

      // Handle the actual response format from the backend
      console.log('🔍 Login Response:', response);
      console.log('🔍 Response.success:', response.success);
      console.log('🔍 Response.data:', response.data);
      console.log('🔍 Response.data.user:', response.data?.user);
      console.log('🔍 Response.data.token:', response.data?.token);
      console.log('🔍 Response.status:', response.status);
      console.log('🔍 Response.message:', response.message);
      
      // Log supervisor data
      console.log('👨‍💼 User supervisor:', response.data?.user?.supervisor);
      console.log('👨‍💼 User supervisor_id:', response.data?.user?.supervisor_id);
      console.log('👨‍💼 User supervisor_name:', response.data?.user?.supervisor_name);
      console.log('👨‍💼 Supervisor name:', response.data?.user?.supervisor?.name);
      console.log('👨‍💼 Supervisor email:', response.data?.user?.supervisor?.email);
      console.log('👨‍💼 Supervisor role:', response.data?.user?.supervisor?.role);
      console.log('👨‍💼 Distributor name:', response.data?.user?.distributor_name);
      
      // Check if login was successful - handle the actual response format
      if (response.success && response.data && response.data.user && response.data.token) {
        // The backend returns { success: true, data: { user: {...}, token: "...", token_type: "Bearer" } }
        const { user, token, token_type } = response.data;
        
        // Store user data and token
        if (token) {
          await tokenManager.setToken(token);
        }
        await tokenManager.setUserData(user);
        
        return {
          success: true,
          data: { user, token, token_type },
          message: 'تم تسجيل الدخول بنجاح'
        };
      } else if (response.success && response.data && response.data.data && response.data.data.user && response.data.data.token) {
        // Handle case where data is nested in response.data.data
        const { user, token, token_type } = response.data.data;
        
        // Store user data and token
        if (token) {
          await tokenManager.setToken(token);
        }
        await tokenManager.setUserData(user);
        
        return {
          success: true,
          data: { user, token, token_type },
          message: 'تم تسجيل الدخول بنجاح'
        };
      } else if (response.data && response.data.user && response.data.token) {
        // Handle case where success might be false but data exists
        const { user, token, token_type } = response.data;
        
        // Store user data and token
        if (token) {
          await tokenManager.setToken(token);
        }
        await tokenManager.setUserData(user);
        
        return {
          success: true,
          data: { user, token, token_type },
          message: 'تم تسجيل الدخول بنجاح'
        };
      } else if (response.success && response.user && response.token) {
        // Handle case where data is directly in response (not nested in data)
        const { user, token, token_type } = response;
        
        // Store user data and token
        if (token) {
          await tokenManager.setToken(token);
        }
        await tokenManager.setUserData(user);
        
        return {
          success: true,
          data: { user, token, token_type },
          message: 'تم تسجيل الدخول بنجاح'
        };
      } else {
        // Handle different error cases from the backend
        let errorMessage = 'فشل في تسجيل الدخول';
        
        console.log('❌ Login Failed - Full Response:', response);
        console.log('❌ Response.data:', response.data);
        console.log('❌ Response.message:', response.message);
        console.log('❌ Response.error:', response.error);
        
        // Check for specific error messages from backend
        if (response.data?.message === 'email') {
          errorMessage = 'البريد الإلكتروني غير موجود';
        } else if (response.data?.message === 'pass') {
          errorMessage = 'كلمة المرور غير صحيحة';
        } else if (response.data?.message === 'Invalid credentials') {
          errorMessage = 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
        } else if (response.data?.message === 'Email or password is incorrect') {
          errorMessage = 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
        } else if (response.data?.message) {
          errorMessage = response.data.message;
        } else if (response.message) {
          errorMessage = response.message;
        } else if (response.error) {
          errorMessage = response.error;
        } else {
          errorMessage = 'فشل في تسجيل الدخول';
        }
        
        console.log('❌ Final Error Message:', errorMessage);
        
        return {
          success: false,
          message: errorMessage,
          errors: response.data?.errors,
          fullResponse: response
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'خطأ في الاتصال بالخادم',
        error: error.message
      };
    }
  }

  /**
   * User registration
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Registration response
   */
  async register(userData) {
    try {
      const response = await apiRequest({
        method: 'POST',
        url: API.auth.register,
        data: userData
      });

      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: 'تم إنشاء الحساب بنجاح'
        };
      } else {
        return {
          success: false,
          message: response.data?.message || 'فشل في إنشاء الحساب',
          errors: response.data?.errors
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'خطأ في الاتصال بالخادم',
        error: error.message
      };
    }
  }

  /**
   * User logout
   * @returns {Promise<Object>} Logout response
   */
  async logout() {
    try {
      const response = await apiRequest({
        method: 'POST',
        url: API.auth.logout
      });

      // Clear local storage regardless of API response
      await tokenManager.removeToken();

      return {
        success: true,
        message: 'تم تسجيل الخروج بنجاح'
      };
    } catch (error) {
      // Even if API call fails, clear local storage
      await tokenManager.removeToken();
      return {
        success: true,
        message: 'تم تسجيل الخروج بنجاح'
      };
    }
  }

  /**
   * Delete user account
   * @returns {Promise<Object>} Delete account response
   */
  async deleteAccount() {
    try {
      const response = await apiRequest({
        method: 'DELETE',
        url: API.auth.delete_account
      });

      // Clear local storage after successful deletion
      if (response.success) {
        await tokenManager.removeToken();
      }

      return {
        success: response.success,
        message: response.success ? 'تم حذف الحساب بنجاح' : 'فشل في حذف الحساب',
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: 'خطأ في الاتصال بالخادم',
        error: error.message
      };
    }
  }

  /**
   * Check if user is authenticated
   * @returns {Promise<boolean>} Authentication status
   */
  async isAuthenticated() {
    try {
      const token = await tokenManager.getToken();
      const userData = await tokenManager.getUserData();
      // Consider authenticated if we have either token or user data
      return !!(token || userData);
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }

  /**
   * Get current user data
   * @returns {Promise<Object|null>} User data or null
   */
  async getCurrentUser() {
    try {
      return await tokenManager.getUserData();
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  /**
   * Get authentication token
   * @returns {Promise<string|null>} Token or null
   */
  async getToken() {
    try {
      return await tokenManager.getToken();
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  /**
   * Refresh authentication token
   * @returns {Promise<Object>} Token refresh response
   */
  async refreshToken() {
    try {
      const currentToken = await tokenManager.getToken();
      if (!currentToken) {
        return {
          success: false,
          message: 'لا يوجد رمز مصادقة'
        };
      }

      // This would typically call a refresh endpoint
      // For now, we'll just return the current token
      return {
        success: true,
        token: currentToken
      };
    } catch (error) {
      return {
        success: false,
        message: 'فشل في تحديث رمز المصادقة',
        error: error.message
      };
    }
  }

  /**
   * Validate token with server
   * @returns {Promise<Object>} Token validation response
   */
  async validateToken() {
    try {
      // محاولة استخدام endpoint مختلف للتحقق من التوكن
      const response = await apiRequest({
        method: 'GET',
        url: 'auth/me' // محاولة استخدام endpoint مختلف
      });

      return {
        success: response.success,
        data: response.data,
        message: response.success ? 'الرمز صالح' : 'الرمز غير صالح'
      };
    } catch (error) {
      // إذا كان الخطأ 401 (غير مصرح)، فالتوكن غير صالح
      if (error.response?.status === 401) {
        console.log('🔐 Token expired - 401 Unauthorized');
        return {
          success: false,
          message: 'انتهت صلاحية الجلسة',
          error: error.message
        };
      }
      
      // إذا كان الخطأ في الشبكة أو الخادم، لا نعتبر التوكن غير صالح
      console.log('⚠️ Token validation failed due to network/server error:', error.message);
      return {
        success: false,
        message: 'فشل في التحقق من الرمز',
        error: error.message,
        isNetworkError: true // إضافة علامة لتمييز أخطاء الشبكة
      };
    }
  }

  /**
   * Clear all authentication data
   * @returns {Promise<void>}
   */
  async clearAuthData() {
    try {
      await tokenManager.removeToken();
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  }

  /**
   * Update user profile
   * @param {Object} profileData - Profile data to update
   * @returns {Promise<Object>} Update response
   */
  async updateProfile(profileData) {
    try {
      const response = await apiRequest({
        method: 'PUT',
        url: 'user/profile',
        data: profileData
      });

      if (response.success) {
        // Update stored user data
        const currentUser = await tokenManager.getUserData();
        const updatedUser = { ...currentUser, ...response.data };
        await tokenManager.setUserData(updatedUser);
      }

      return {
        success: response.success,
        data: response.data,
        message: response.success ? 'تم تحديث الملف الشخصي بنجاح' : 'فشل في تحديث الملف الشخصي',
        errors: response.data?.errors
      };
    } catch (error) {
      return {
        success: false,
        message: 'خطأ في الاتصال بالخادم',
        error: error.message
      };
    }
  }

  /**
   * Change password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Password change response
   */
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await apiRequest({
        method: 'PUT',
        url: 'user/change-password',
        data: {
          current_password: currentPassword,
          new_password: newPassword,
          new_password_confirmation: newPassword
        }
      });

      return {
        success: response.success,
        message: response.success ? 'تم تغيير كلمة المرور بنجاح' : 'فشل في تغيير كلمة المرور',
        errors: response.data?.errors
      };
    } catch (error) {
      return {
        success: false,
        message: 'خطأ في الاتصال بالخادم',
        error: error.message
      };
    }
  }

  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise<Object>} Password reset request response
   */
  async requestPasswordReset(email) {
    try {
      const response = await apiRequest({
        method: 'POST',
        url: 'password/email',
        data: { email }
      });

      return {
        success: response.success,
        message: response.success ? 'تم إرسال رابط إعادة تعيين كلمة المرور' : 'فشل في إرسال الرابط',
        errors: response.data?.errors
      };
    } catch (error) {
      return {
        success: false,
        message: 'خطأ في الاتصال بالخادم',
        error: error.message
      };
    }
  }

  /**
   * Reset password with token
   * @param {string} token - Reset token
   * @param {string} email - User email
   * @param {string} password - New password
   * @param {string} passwordConfirmation - Password confirmation
   * @returns {Promise<Object>} Password reset response
   */
  async resetPassword(token, email, password, passwordConfirmation) {
    try {
      const response = await apiRequest({
        method: 'POST',
        url: 'password/reset',
        data: {
          token,
          email,
          password,
          password_confirmation: passwordConfirmation
        }
      });

      return {
        success: response.success,
        message: response.success ? 'تم إعادة تعيين كلمة المرور بنجاح' : 'فشل في إعادة تعيين كلمة المرور',
        errors: response.data?.errors
      };
    } catch (error) {
      return {
        success: false,
        message: 'خطأ في الاتصال بالخادم',
        error: error.message
      };
    }
  }
}

// Create and export service instance
const authService = new AuthService();
export default authService;

// Export individual methods for convenience
export const {
  login,
  register,
  logout,
  deleteAccount,
  isAuthenticated,
  getCurrentUser,
  getToken,
  refreshToken,
  validateToken,
  clearAuthData,
  updateProfile,
  changePassword,
  requestPasswordReset,
  resetPassword
} = authService;
