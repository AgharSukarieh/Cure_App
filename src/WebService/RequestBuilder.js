import axios, { patch } from "axios";
import { Alert } from 'react-native';
import { err } from "react-native-svg/lib/typescript/xml";
import API from '../config/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiClient = axios.create({
  baseURL: API.baseURL,
  timeout: 60000,
});

let activeRequests = 0;
let isLoading = false;

const showLoadingIndicator = () => {
  if (activeRequests === 0) {
    isLoading = true;
    // console.log('Show loading indicator');
  }
  activeRequests++;
};

const hideLoadingIndicator = () => {
  activeRequests--;
  if (activeRequests === 0) {
    isLoading = false;
    // console.log('Hide loading indicator');
  }
};

apiClient.interceptors.request.use(
  async (config) => {
    showLoadingIndicator();
    config.headers['Accept'] = 'application/json';
    // Content-Type سيتم تعيينه تلقائياً حسب نوع البيانات
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    } else {
      config.headers['Content-Type'] = 'application/json';
    }
    
    // إضافة التوكن من AsyncStorage إذا لم يكن موجوداً في الهيدر
    if (!config.headers.Authorization) {
      try {
        const token = await AsyncStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('❌ Error getting token from AsyncStorage:', error);
      }
    }
    
    // console.log('----------API config Start------');
    // console.log(config);
    // console.log('----------API config End------');
    return config;
  },
  error => {
    hideLoadingIndicator();
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  response => {
    // console.log('----------API Response Start------');
    // console.log(response.data);
    // console.log('----------API Response End------');
    hideLoadingIndicator();
    return response;
  },
  error => {
    hideLoadingIndicator();
    // Alert.alert('Error', error.message);
    return Promise.reject(error);
  },
);

// const request = async (method, url, data = null, params = {}) => {
//   try {
//     const response = await apiClient.request({ method, url, data, params });
//     return response.data;
//   } catch (error) {
//     const isUnauthenticated = error?.message?.includes('401')
//     if (isUnauthenticated) {
//       Alert.alert("Please log out and log in again")
//     } else {
//       Alert.alert(error.response?.data?.message || error.message)
//     }
//     is_422_error = error?.message?.includes('422')
//     if (is_422_error) {
//       if (error.response.data.errors != undefined) {
//         for (errorItem in error.response.data.errors) {
//           Alert.alert(error.response.data.errors[errorItem][0])
//         }
//       }
//     }else{
//       throw new Error(error.response?.data?.message || error.message);
//     }
//   }
// };
const request = async (method, url, data = null, params = {}) => {
  try {
    // Debug: قبل إرسال الـ request
    console.log('🚀 API Request Starting:', {
      method: method.toUpperCase(),
      url: url,
      baseURL: apiClient.defaults.baseURL,
      fullURL: `${apiClient.defaults.baseURL}${url}`,
      data: data,
      params: params,
      timeout: apiClient.defaults.timeout
    });

    const response = await apiClient.request({ method, url, data, params });
    
    // Debug: بعد استلام الـ response
    console.log('✅ API Response Received:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      headers: response.headers
    });
    
    // تحقق من وجود البيانات
    if (response && response.data) {
      return response.data;
    }
    throw new Error('No data received from server');
    
  } catch (error) {
    // Debug: تفاصيل الخطأ
    console.log('❌ API Error Details:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      url: url,
      baseURL: apiClient.defaults.baseURL,
      fullURL: `${apiClient.defaults.baseURL}${url}`,
      timeout: apiClient.defaults.timeout,
      response: error.response?.data,
      request: error.request
    });

    // معالجة timeout
    if (error.code === 'ECONNABORTED') {
      console.log('Request timeout - زيادة timeout أو تحقق من الاتصال');
      Alert.alert("Timeout", "Request timeout. Please check your connection and try again.");
      throw new Error('Request timeout');
    }

    // معالجة network errors
    if (error.message === 'Network Error') {
      console.log('Network Error - تحقق من الاتصال بالسيرفر');
      Alert.alert("Network Error", "Cannot connect to server. Please check your connection.");
      throw new Error('Network connection failed');
    }

    const isUnauthenticated = error?.response?.status === 401;
    if (isUnauthenticated) {
      Alert.alert("Authentication Error", "Please log out and log in again");
      throw new Error('Unauthenticated');
    }

    const is422Error = error?.response?.status === 422;
    if (is422Error) {
      if (error.response?.data?.errors) {
        for (const errorItem in error.response.data.errors) {
          Alert.alert("Validation Error", error.response.data.errors[errorItem][0]);
        }
      }
      throw new Error('Validation failed');
    }

    // معالجة الأخطاء العامة
    const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
    Alert.alert("API Error", errorMessage);
    throw new Error(errorMessage);
  }
};


const createApiFunction = method =>
  async (url, data = null, params = {}) => {
    try {
      const response = await request(method, url, data, params);
      return response;
    } catch (error) {
      console.log(`API ${method.toUpperCase()} Error for ${url}:`, error.message);
      throw error;
    }
  };

export const get = createApiFunction('get');
export const post = createApiFunction('post');
export const put = createApiFunction('put');
export const del = createApiFunction('delete');


export const uploadFiles = async (url, files, body = {}) => {
  try {
    const formData = new FormData();

    files.forEach(file => {
      formData.append(`images[]`, {
        uri: file.path,
        type: file.mime,
        name: file.fileName
      });
    });

    Object.entries(body).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const response = await request('post', url, formData, null);
    
    // تحقق من وجود البيانات
    if (response && response.data) {
      return response;
    }
    throw new Error('No data received from upload');
    
  } catch (error) {
    console.log('Upload Error Details:', {
      message: error.message,
      code: error.code,
      url: url
    });

    if (error.code === 'ECONNABORTED') {
      console.log('Upload timeout');
      Alert.alert("Upload Timeout", "File upload timeout. Please try again.");
      throw new Error('Upload timeout');
    }

    if (error.message === 'Network Error') {
      console.log('Upload Network Error');
      Alert.alert("Upload Error", "Cannot upload files. Please check your connection.");
      throw new Error('Upload network failed');
    }

    throw new Error(error.response?.data?.message || error.message || 'Upload failed');
  }
};

// Pagination handling
export const getPage = async (url, page = 1, limit = 10, param = {}, data = null) => {
  try {
    const params = { ...param, page, limit, _page: page };
    const response = await get(url, data, params);
    
    // تحقق من وجود البيانات
    if (response && response.data) {
      return response;
    }
    throw new Error('No pagination data received');
    
  } catch (error) {
    console.log('Pagination Error:', {
      message: error.message,
      url: url,
      page: page
    });
    throw error;
  }
};

// Custom headers handling
export const setHeaders = headers => {
  Object.assign(apiClient.defaults.headers.common, headers);
};

export const setAuthToken = (token) => {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const clearAuthToken = () => {
  delete apiClient.defaults.headers.common['Authorization'];
};

export const isLoadingIndicatorVisible = () => {
  return isLoading;
};

