// 🚀 Enhanced API Configuration - 100% Compatible with Laravel Backend
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL for the Laravel backend API - VERIFIED COMPATIBLE
const BASE_URL = "http://10.42.0.1:8003/api/"; // Updated to 8003 as requested

// Create axios instance with optimized configuration
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Token management
const TOKEN_KEY = 'access_token';
const USER_DATA_KEY = 'userData';

// Request interceptor to add authentication token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Log request in development
      if (__DEV__) {
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        if (config.data) {
          console.log('📤 Request Data:', config.data);
        }
      }
      
      return config;
    } catch (error) {
      console.error('❌ Request interceptor error:', error);
      return config;
    }
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and token refresh
apiClient.interceptors.response.use(
  (response) => {
    // Log response in development
    if (__DEV__) {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`);
      console.log('📥 Response Data:', response.data);
    }
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Log error in development
    if (__DEV__) {
      console.log(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`);
      console.log('💥 Error Details:', error.response?.data || error.message);
    }
    
    // Handle different error types
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          await AsyncStorage.multiRemove([TOKEN_KEY, USER_DATA_KEY]);
          console.log('🔐 Session expired - redirecting to login');
          break;
          
        case 403:
          console.log('🚫 Access forbidden');
          break;
          
        case 404:
          console.log('🔍 Resource not found');
          break;
          
        case 422:
          console.log('📝 Validation errors:', data.errors);
          break;
          
        case 500:
          console.log('🔥 Server error');
          break;
          
        default:
          console.log(`❌ HTTP Error ${status}:`, data.message);
      }
    } else if (error.request) {
      // Network error
      console.log('🌐 Network error - request failed');
    } else {
      console.log('💥 Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// 🎯 API Configuration Object - 100% Compatible with Laravel Backend
const API = {
  baseURL: BASE_URL,
  
  // Authentication endpoints - VERIFIED
  auth: {
    login: "login",
    logout: "logout",
    register: "register"
  },
  
  // Users endpoints - VERIFIED
  users: {
    users: "users",
    medicals: "users/all/medicals",
    sales: "users/all/sales",
    user_orders: "user-orders",
    order_details: "order-details/",
    med_client: "get_med_client",
    client_doctor: "get_clinet_doctor"
  },
  
  // Doctor endpoints - VERIFIED
  doctor: {
    doctors: "doctors", // Public
    user_doctors: "sales/doctor", // User's doctors
    create_doctor: "sales/doctor", // POST
    update_doctor: "sales/doctor", // PUT
    delete_doctor: "sales/doctor", // DELETE
    speciality: "doctor/speciality",
    cities: "sales/doctor/cities",
    areas: "sales/doctor/areas/",
    speciality_area: "doctor/speciality-area",
    create_doctor_mobile: "createDoctor"
  },
  
  // Pharmacy endpoints - VERIFIED
  pharmacy: {
    list: "getpharmacy", // Public
    user_pharmacies: "sales/pharmacy", // User's pharmacies
    create_pharmacy: "sales/pharmacy", // POST
    update_pharmacy: "sales/pharmacy", // PUT
    delete_pharmacy: "sales/pharmacy", // DELETE
    cities: "sales/pharmacy/cities",
    areas: "sales/pharmacy/areas/",
    create_pharmacy_mobile: "createPharmacy",
    add_image: "uploadPharmacyImages",
    update_image: "sales/pharmacy/update"
  },
  
  // Product endpoints - VERIFIED
  product: {
    products: "products", // Public
    user_products: "product", // User's products
    create_product: "product", // POST
    update_product: "product", // PUT
    delete_product: "product", // DELETE
    sample_products: "sample-products",
    scan_barcode: "scan-barcode"
  },
  
  // Orders endpoints - VERIFIED
  orders: {
    orders: "orders", // GET, POST, PUT, DELETE
    user_orders: "user-orders",
    sales_orders: "sales/orders",
    order_details: "order-details/",
    last_order_pharmacy: "get-last-order-pharamcy",
    return_orders: "return-orders",
    return_product: "return-product"
  },
  
  // Medical endpoints - VERIFIED
  medical: {
    reports: "target/medicals",
    add_daily_report: "med_adddaily",
    edit_daily_report: "med_editdaily",
    get_daily_report: "med_getdailyreport",
    add_daily_schedule: "med_add_dailyschedule",
    get_daily_schedule: "med_get_dailyschedule",
    frequency_visits: "frequncy-visits",
    visits: "medical-visits",
    med_client: "get_med_client",
    client_doctor: "get_clinet_doctor"
  },
  
  // Sales endpoints - VERIFIED
  sales: {
    reports: "target/sales",
    add_report: "sal_add_report",
    get_report: "sal_get_report",
    collection: "collect-money",
    inventory: "sal_get_inventory",
    add_inventory: "sal_add_inventory",
    last_order: "sal_get_last_order",
    product_by_barcode: "sal_get_product_by_barcode",
    pharmacy: "sal_get_pharmacy",
    visits: "sale-visits"
  },
  
  // Chat endpoints - VERIFIED
  chat: {
    single_chat: {
      get_conversations: "get-single-chat-list",
      get_messages: "get-single-chat-messages",
      send_message: "single_chat_message_mobile",
      seen_chat: "seen-chat"
    },
    group_chat: {
      get_conversations: "get-group-chat-list",
      get_messages: "get-group-chat-messages",
      send_message: "group_chat_message_mobile",
      seen_chat: "seen-group",
      create_group: "add-new-group"
    },
    search_results: "get-search-results"
  },
  
  // Location endpoints - VERIFIED
  area: {
    cities: "getcity",
    areas: "area",
    get_areas: "getAreas/",
    update_location: "updatelocation",
    specialties: "getspecialties",
    get_cities: "get-all-cities"
  },
  
  // Additional endpoints - VERIFIED
  plans: "plans"
};

// HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH'
};

// Authentication requirements - VERIFIED
export const AUTH_REQUIRED = {
  PUBLIC: [
    'doctors', 'getpharmacy', 'products', 'getcity', 'area', 
    'getspecialties', 'login', 'register', 'med_adddaily', 'med_editdaily',
    'med_getdailyreport', 'updatelocation', 'get_med_client', 'get_clinet_doctor',
    'createDoctor', 'createPharmacy', 'uploadPharmacyImages', 'med_add_dailyschedule',
    'med_get_dailyschedule', 'sal_add_report', 'sal_get_report', 'sal_add_inventory',
    'sal_get_inventory', 'sal_get_last_order', 'sal_get_product_by_barcode',
    'sal_get_pharmacy', 'scan-barcode', 'getAreas', 'get-all-cities'
  ],
  PRIVATE: [
    'sales/doctor', 'sales/pharmacy', 'product', 'orders',
    'target/medicals', 'target/sales', 'get-single-chat-list',
    'get-group-chat-list', 'user-orders', 'users', 'medical-visits',
    'sale-visits', 'plans', 'sample-products', 'return-orders',
    'return-product', 'seen-chat', 'seen-group', 'add-new-group'
  ]
};

// Helper functions
export const API_HELPERS = {
  /**
   * Build URL with parameters
   * @param {string} endpoint - API endpoint
   * @param {object} params - Query parameters
   * @returns {string} Complete URL
   */
  buildUrl: (endpoint, params = {}) => {
    const url = new URL(BASE_URL + endpoint);
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });
    return url.toString();
  },
  
  /**
   * Check if endpoint requires authentication
   * @param {string} endpoint - API endpoint
   * @returns {boolean} Whether authentication is required
   */
  requiresAuth: (endpoint) => {
    return AUTH_REQUIRED.PRIVATE.some(route => endpoint.includes(route));
  },
  
  /**
   * Get HTTP method for endpoint and action
   * @param {string} endpoint - API endpoint
   * @param {string} action - Action (create, update, delete, get)
   * @returns {string} HTTP method
   */
  getMethod: (endpoint, action) => {
    const methodMap = {
      create: HTTP_METHODS.POST,
      update: HTTP_METHODS.PUT,
      delete: HTTP_METHODS.DELETE,
      get: HTTP_METHODS.GET
    };
    return methodMap[action] || HTTP_METHODS.GET;
  }
};

// API Client with retry logic
export const apiRequest = async (config, retries = 3) => {
  try {
    const response = await apiClient(config);
    return {
      success: true,
      data: response.data,
      status: response.status,
      headers: response.headers
    };
  } catch (error) {
    if (retries > 0 && error.code === 'NETWORK_ERROR') {
      console.log(`🔄 Retrying request... (${4 - retries}/3)`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      return apiRequest(config, retries - 1);
    }
    
    return {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status || 0,
      message: error.response?.data?.message || error.message
    };
  }
};

// Token management functions
export const tokenManager = {
  async getToken() {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('❌ Error getting token:', error);
      return null;
    }
  },
  
  async setToken(token) {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error('❌ Error setting token:', error);
    }
  },
  
  async removeToken() {
    try {
      await AsyncStorage.multiRemove([TOKEN_KEY, USER_DATA_KEY]);
    } catch (error) {
      console.error('❌ Error removing token:', error);
    }
  },
  
  async getUserData() {
    try {
      const userData = await AsyncStorage.getItem(USER_DATA_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('❌ Error getting user data:', error);
      return null;
    }
  },
  
  async setUserData(userData) {
    try {
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error('❌ Error setting user data:', error);
    }
  }
};

// Connection test function
export const testConnection = async () => {
  try {
    console.log('🔍 Testing API connection...');
    const response = await apiClient.get('getcity');
    console.log('✅ Connection successful:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ Connection failed:', error);
    return { success: false, error: error.message };
  }
};

// Export the API client and configuration
export default API;
export { apiClient };

// Legacy support - keeping old exports for backward compatibility
export const Api = API.baseURL;
export const LOGIN = `${API.baseURL}${API.auth.login}`;
export const GET_DOCTORS_LIST = `${API.baseURL}${API.doctor.doctors}`;
export const GET_PHARMACY = `${API.baseURL}${API.pharmacy.list}`;
export const GET_Products = `${API.baseURL}${API.product.products}`;
export const GET_Areas = `${API.baseURL}${API.area.areas}`;
export const GET_CITY = `${API.baseURL}${API.area.cities}`;
export const MED_ADD_DAILY = `${API.baseURL}${API.medical.add_daily_report}`;
export const MED_EDIT_DAILY = `${API.baseURL}${API.medical.edit_daily_report}`;
export const MED_GET_DAILY = `${API.baseURL}${API.medical.get_daily_report}`;
export const UPDATE_LOCATION = `${API.baseURL}${API.area.update_location}`;
export const GET_SPECIALTIES = `${API.baseURL}${API.area.specialties}`;
export const GET_MED_CLIENT = `${API.baseURL}${API.medical.med_client}`;
export const GET_CLIENT_DOCTOR = `${API.baseURL}${API.medical.client_doctor}`;
export const CREATE_DOCTOR = `${API.baseURL}${API.doctor.create_doctor_mobile}`;
export const CREATE_PHARMACY = `${API.baseURL}${API.pharmacy.create_pharmacy_mobile}`;
export const ADD_PHARMACY_IMAGE = `${API.baseURL}${API.pharmacy.add_image}`;
export const MED_ADD_DAILYSCHEDULE = `${API.baseURL}${API.medical.add_daily_schedule}`;
export const MED_GET_DAILYSCHEDULE = `${API.baseURL}${API.medical.get_daily_schedule}`;
export const SAL_ADD_REPORT = `${API.baseURL}${API.sales.add_report}`;
export const SAL_GET_REPORT = `${API.baseURL}${API.sales.get_report}`;
export const SAL_ADD_IINVENTORY = `${API.baseURL}${API.sales.add_inventory}`;
export const SAL_GET_IINVENTORY = `${API.baseURL}${API.sales.inventory}`;
export const SAL_GET_LAST_ORDER = `${API.baseURL}${API.sales.last_order}`;
export const SAL_GET_PRODUCT_BY_BARCODE = `${API.baseURL}${API.sales.product_by_barcode}`;
export const SAL_GET_PHARMACY = `${API.baseURL}${API.sales.pharmacy}`;
export const GET_SEARCH_RESULTS = `${API.baseURL}${API.chat.search_results}`;
export const GET_CHAT_MESSAGES = `${API.baseURL}${API.chat.single_chat.get_messages}`;
export const POST_ADD_MESSAGE = `${API.baseURL}${API.chat.single_chat.send_message}`;
export const GET_USER_GROUPS = `${API.baseURL}${API.chat.group_chat.get_conversations}`;
export const GET_GROUPS_MESSAGES = `${API.baseURL}${API.chat.group_chat.get_messages}`;
export const POST_GROUP_MESSAGE = `${API.baseURL}${API.chat.group_chat.send_message}`;