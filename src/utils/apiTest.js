// API Test Utility
import API from '../config/apiConfig';
import axios from 'axios';

/**
 * Test the new API configuration
 */
export const testNewAPI = async () => {
  console.log('🔄 Testing New API Structure...');
  
  try {
    // Test doctors endpoint
    console.log('Testing doctors endpoint...');
    const doctorsResponse = await axios.get(`${API.baseURL}${API.doctor.doctors}`);
    console.log('✅ Doctors API:', doctorsResponse.status);
    
    // Test products endpoint
    console.log('Testing products endpoint...');
    const productsResponse = await axios.get(`${API.baseURL}${API.product.products}`);
    console.log('✅ Products API:', productsResponse.status);
    
    // Test areas endpoint
    console.log('Testing areas endpoint...');
    const areasResponse = await axios.get(`${API.baseURL}${API.area.area}`);
    console.log('✅ Areas API:', areasResponse.status);
    
    console.log('🎉 All API tests passed!');
    return true;
    
  } catch (error) {
    console.log('❌ API Test Error:', error.message);
    console.log('Error details:', error.response?.data || error.response?.status);
    return false;
  }
};

/**
 * Test specific endpoint
 */
export const testEndpoint = async (endpoint, method = 'GET', data = null) => {
  try {
    const config = {
      method,
      url: `${API.baseURL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    };
    
    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      config.data = data;
    }
    
    const response = await axios(config);
    console.log(`✅ ${method} ${endpoint}:`, response.status);
    return response;
    
  } catch (error) {
    console.log(`❌ ${method} ${endpoint} Error:`, error.message);
    return null;
  }
};

/**
 * Test all main endpoints
 */
export const testAllEndpoints = async () => {
  const endpoints = [
    { endpoint: API.doctor.doctors, method: 'GET' },
    { endpoint: API.product.products, method: 'GET' },
    { endpoint: API.area.area, method: 'GET' },
    { endpoint: API.area.city, method: 'GET' },
    { endpoint: API.area.specialties, method: 'GET' },
    { endpoint: API.pharmacy.list, method: 'GET' },
  ];
  
  console.log('🧪 Testing all endpoints...');
  
  for (const { endpoint, method } of endpoints) {
    await testEndpoint(endpoint, method);
  }
  
  console.log('🏁 Endpoint testing completed!');
};

export default {
  testNewAPI,
  testEndpoint,
  testAllEndpoints
};
