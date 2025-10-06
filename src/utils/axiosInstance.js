// Axios Instance Configuration
import axios from 'axios';
import { axiosConfig } from './apiHelper';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create axios instance
const axiosInstance = axios.create(axiosConfig);

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      // Get token from AsyncStorage
      const token = await AsyncStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.log('Error getting token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Clear stored token
        await AsyncStorage.removeItem('access_token');
        await AsyncStorage.removeItem('userData');
        
        // You can add navigation to login screen here if needed
        console.log('Session expired, please login again');
        
      } catch (storageError) {
        console.log('Error clearing storage:', storageError);
      }
    }
    
    // Handle network errors
    if (!error.response) {
      console.log('Network Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
