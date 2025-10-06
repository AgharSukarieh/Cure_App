// Authentication Context
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import authService from '../services/authService';
import { setAuthToken, clearAuthToken } from '../WebService/RequestBuilder';

// Initial state
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  error: null
};

// Action types
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  REGISTER_START: 'REGISTER_START',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_FAILURE: 'REGISTER_FAILURE',
  UPDATE_PROFILE: 'UPDATE_PROFILE',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  CHECK_AUTH_START: 'CHECK_AUTH_START',
  CHECK_AUTH_SUCCESS: 'CHECK_AUTH_SUCCESS',
  CHECK_AUTH_FAILURE: 'CHECK_AUTH_FAILURE'
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
    case AUTH_ACTIONS.REGISTER_START:
    case AUTH_ACTIONS.CHECK_AUTH_START:
      return {
        ...state,
        loading: true,
        error: null
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
    case AUTH_ACTIONS.CHECK_AUTH_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
    case AUTH_ACTIONS.REGISTER_FAILURE:
    case AUTH_ACTIONS.CHECK_AUTH_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };

    case AUTH_ACTIONS.REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };

    case AUTH_ACTIONS.UPDATE_PROFILE:
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };

    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  /**
   * Check authentication status
   */
  const checkAuthStatus = async () => {
    try {
      dispatch({ type: AUTH_ACTIONS.CHECK_AUTH_START });
      
      const isAuth = await authService.isAuthenticated();
      const userData = await authService.getCurrentUser();
      
      if (isAuth && userData) {
        const token = await authService.getToken();
        // إعداد التوكن في RequestBuilder
        if (token) {
          setAuthToken(token);
        }
        dispatch({
          type: AUTH_ACTIONS.CHECK_AUTH_SUCCESS,
          payload: { user: userData, token: token }
        });
      } else {
        dispatch({
          type: AUTH_ACTIONS.CHECK_AUTH_FAILURE,
          payload: 'غير مسجل الدخول'
        });
      }
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.CHECK_AUTH_FAILURE,
        payload: error.message
      });
    }
  };

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Login result
   */
  const login = async (email, password) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START });
      
      const result = await authService.login(email, password);
      
      console.log('🔍 AuthContext Login Result:', result);
      console.log('🔍 Result.success:', result.success);
      console.log('🔍 Result.data:', result.data);
      console.log('🔍 Result.data.user:', result.data?.user);
      console.log('🔍 Result.data.token:', result.data?.token);
      console.log('🔍 Result.message:', result.message);
      console.log('🔍 Result.error:', result.error);
      
      // Log supervisor data
      console.log('👨‍💼 Supervisor data:', result.data?.user?.supervisor);
      console.log('👨‍💼 Supervisor name:', result.data?.user?.supervisor?.name);
      console.log('👨‍💼 Supervisor ID:', result.data?.user?.supervisor_id);
      console.log('👨‍💼 Supervisor email:', result.data?.user?.supervisor?.email);
      console.log('👨‍💼 Supervisor role:', result.data?.user?.supervisor?.role);
      console.log('👨‍💼 Distributor name:', result.data?.user?.distributor_name);
      
      // التحقق من النجاح - يتحقق من وجود البيانات الصحيحة
      if (result.success && result.data && result.data.user && result.data.token) {
        console.log('✅ Login Success - Dispatching LOGIN_SUCCESS');
        // إعداد التوكن في RequestBuilder
        setAuthToken(result.data.token);
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user: result.data.user, token: result.data.token }
        });
      } else if (result.data && result.data.user && result.data.token) {
        // Handle case where success might be false but data exists
        console.log('✅ Login Success (with success=false) - Dispatching LOGIN_SUCCESS');
        // إعداد التوكن في RequestBuilder
        setAuthToken(result.data.token);
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user: result.data.user, token: result.data.token }
        });
      } else {
        console.log('❌ Login Failed - Dispatching LOGIN_FAILURE');
        console.log('❌ Result.message:', result.message);
        console.log('❌ Result.error:', result.error);
        console.log('❌ Result.fullResponse:', result.fullResponse);
        
        dispatch({
          type: AUTH_ACTIONS.LOGIN_FAILURE,
          payload: result.message || result.error || 'فشل في تسجيل الدخول'
        });
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'خطأ في تسجيل الدخول';
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage
      });
      return { success: false, message: errorMessage };
    }
  };

  /**
   * Register user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Registration result
   */
  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.REGISTER_START });
      
      const result = await authService.register(userData);
      
      if (result.success) {
        dispatch({ type: AUTH_ACTIONS.REGISTER_SUCCESS });
      } else {
        dispatch({
          type: AUTH_ACTIONS.REGISTER_FAILURE,
          payload: result.message
        });
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'خطأ في إنشاء الحساب';
      dispatch({
        type: AUTH_ACTIONS.REGISTER_FAILURE,
        payload: errorMessage
      });
      return { success: false, message: errorMessage };
    }
  };

  /**
   * Logout user
   * @returns {Promise<Object>} Logout result
   */
  const logout = async () => {
    try {
      // مسح التوكن من RequestBuilder
      clearAuthToken();
      const result = await authService.logout();
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      return result;
    } catch (error) {
      // Even if logout fails, clear local state
      clearAuthToken();
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      return { success: true, message: 'تم تسجيل الخروج بنجاح' };
    }
  };

  /**
   * Delete user account
   * @returns {Promise<Object>} Delete account result
   */
  const deleteAccount = async () => {
    try {
      const result = await authService.deleteAccount();
      
      if (result.success) {
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
      } else {
        dispatch({
          type: AUTH_ACTIONS.SET_ERROR,
          payload: result.message
        });
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'خطأ في حذف الحساب';
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: errorMessage
      });
      return { success: false, message: errorMessage };
    }
  };

  /**
   * Update user profile
   * @param {Object} profileData - Profile data to update
   * @returns {Promise<Object>} Update result
   */
  const updateProfile = async (profileData) => {
    try {
      const result = await authService.updateProfile(profileData);
      
      if (result.success) {
        dispatch({
          type: AUTH_ACTIONS.UPDATE_PROFILE,
          payload: result.data
        });
      } else {
        dispatch({
          type: AUTH_ACTIONS.SET_ERROR,
          payload: result.message
        });
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'خطأ في تحديث الملف الشخصي';
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: errorMessage
      });
      return { success: false, message: errorMessage };
    }
  };

  /**
   * Change password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Change password result
   */
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const result = await authService.changePassword(currentPassword, newPassword);
      
      if (!result.success) {
        dispatch({
          type: AUTH_ACTIONS.SET_ERROR,
          payload: result.message
        });
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'خطأ في تغيير كلمة المرور';
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: errorMessage
      });
      return { success: false, message: errorMessage };
    }
  };

  /**
   * Clear error
   */
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  /**
   * Set loading state
   * @param {boolean} loading - Loading state
   */
  const setLoading = (loading) => {
    dispatch({
      type: AUTH_ACTIONS.SET_LOADING,
      payload: loading
    });
  };

  /**
   * Set error
   * @param {string} error - Error message
   */
  const setError = (error) => {
    dispatch({
      type: AUTH_ACTIONS.SET_ERROR,
      payload: error
    });
  };

  const value = {
    // State
    user: state.user,
    token: state.token, // Add token to context value
    role: state.user?.role, // Extract role from user
    supervisor: state.user?.supervisor, // Extract supervisor from user
    supervisorName: state.user?.supervisor?.name || state.user?.supervisor_name, // Extract supervisor name
    supervisorId: state.user?.supervisor_id, // Extract supervisor ID
    supervisorEmail: state.user?.supervisor?.email, // Extract supervisor email
    supervisorRole: state.user?.supervisor?.role, // Extract supervisor role
    distributorName: state.user?.distributor_name, // Extract distributor name
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    error: state.error,
    
    // Actions
    login,
    register,
    logout,
    deleteAccount,
    updateProfile,
    changePassword,
    checkAuthStatus,
    clearError,
    setLoading,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext;