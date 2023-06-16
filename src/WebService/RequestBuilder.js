import axios from 'axios';
import {Alert} from 'react-native';

const apiClient = axios.create({
  baseURL: 'http://44.211.184.140/api/',
  timeout: 5000,
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
  config => {
    showLoadingIndicator();
    config.headers['Accept'] = 'application/json';
    console.log('----------API config Start------');
    console.log(config);
    console.log('----------API config End------');
    return config;
  },
  error => {
    hideLoadingIndicator();
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  response => {
    hideLoadingIndicator();
    return response;
  },
  error => {
    hideLoadingIndicator();
    Alert.alert('Error', error.message);
    return Promise.reject(error);
  },
);

const request = async (method, url, data = null, options = {}) => {
  try {
    const response = await apiClient.request({
      method,
      url,
      data,
      ...options,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

const createApiFunction =
  method =>
  async (url, data = null, options = {}) => {
    const response = await request(method, url, data, options);
    return response;
  };

export const get = createApiFunction('get');
export const post = createApiFunction('post');
export const put = createApiFunction('put');
export const del = createApiFunction('delete');

export const uploadFiles = async (url, files, options = {}) => {
  const formData = new FormData();
  files.forEach((file, index) => {
    formData.append(`file${index}`, file);
  });

  const response = await request('post', url, formData, options);
  return response;
};

// Pagination handling
export const getPage = async (
  url,
  page = 1,
  limit = 10,
  params = null,
  options = {},
) => {
  const paginationParams = {
    ...params,
    page,
    limit,
  };

  const response = await get(url, paginationParams, options);
  return response;
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


