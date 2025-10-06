// API Helper Functions
import API from '../config/apiConfig';

/**
 * Get full URL for an API endpoint
 * @param {string} endpoint - The endpoint path
 * @returns {string} - Full URL with base URL
 */
export const getFullUrl = (endpoint) => {
  return `${API.baseURL}${endpoint}`;
};

/**
 * Get full URL for an API endpoint with parameters
 * @param {string} endpoint - The endpoint path
 * @param {object} params - Parameters to append
 * @returns {string} - Full URL with parameters
 */
export const getFullUrlWithParams = (endpoint, params = {}) => {
  let url = `${API.baseURL}${endpoint}`;
  
  // Add query parameters if provided
  const queryParams = new URLSearchParams(params).toString();
  if (queryParams) {
    url += `?${queryParams}`;
  }
  
  return url;
};

/**
 * Get full URL for an API endpoint with ID parameter
 * @param {string} endpoint - The endpoint path
 * @param {string|number} id - ID parameter
 * @returns {string} - Full URL with ID
 */
export const getFullUrlWithId = (endpoint, id) => {
  return `${API.baseURL}${endpoint}${id}`;
};

/**
 * Common API endpoints for quick access
 */
export const ApiEndpoints = {
  // Authentication
  login: getFullUrl(API.auth.login),
  logout: getFullUrl(API.auth.logout),
  register: getFullUrl(API.auth.register),
  
  // Doctors
  doctors: getFullUrl(API.doctor.doctors),
  createDoctor: getFullUrl(API.doctor.create_doctor),
  
  // Pharmacy
  pharmacy: getFullUrl(API.pharmacy.list),
  createPharmacy: getFullUrl(API.pharmacy.create_pharmacy),
  
  // Products
  products: getFullUrl(API.product.products),
  
  // Areas
  areas: getFullUrl(API.area.area),
  cities: getFullUrl(API.area.city),
  specialties: getFullUrl(API.area.specialties),
  
  // Medical
  medicalReports: getFullUrl(API.medical.reports),
  medicalAddDaily: getFullUrl(API.medical.add_daily_report),
  medicalGetDaily: getFullUrl(API.medical.get_daily_report),
  
  // Sales
  salesReports: getFullUrl(API.sales.reports),
  salesAddReport: getFullUrl(API.sales.add_report),
  salesInventory: getFullUrl(API.sales.inventory),
  
  // Chat
  chatMessages: getFullUrl(API.single_chat.get_mess),
  sendMessage: getFullUrl(API.single_chat.send_mess),
  groupMessages: getFullUrl(API.group_chat.get_mess),
  sendGroupMessage: getFullUrl(API.group_chat.send_mess),
  
  // Orders
  orders: getFullUrl(API.orders.add_order),
  userOrders: getFullUrl(API.orders.get_orders),
  orderDetails: (id) => getFullUrlWithId(API.orders.order_details, id),
  
  // Search
  searchResults: getFullUrl(API.get_user_to_chat),
  
  // Location
  updateLocation: getFullUrl(API.update_location)
};

/**
 * Axios configuration helper
 */
export const axiosConfig = {
  baseURL: API.baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
};

export default {
  getFullUrl,
  getFullUrlWithParams,
  getFullUrlWithId,
  ApiEndpoints,
  axiosConfig
};
