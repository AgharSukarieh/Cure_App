// Custom Hook for Orders
import { useState, useEffect, useCallback } from 'react';
import orderService from '../services/orderService';

/**
 * Custom hook for order management
 * @param {Object} options - Hook options
 * @returns {Object} Order state and methods
 */
export const useOrders = (options = {}) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const {
    autoFetch = true,
    initialParams = {}
  } = options;

  // Auto fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      fetchUserOrders(initialParams);
    }
  }, [autoFetch]);

  /**
   * Fetch user orders
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Fetch result
   */
  const fetchUserOrders = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await orderService.getUserOrders(params);
      
      if (result.success) {
        setOrders(result.data);
        setPagination(result.pagination);
      } else {
        setError(result.message);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'خطأ في جلب طلباتك';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create new order
   * @param {Object} orderData - Order data
   * @returns {Promise<Object>} Create result
   */
  const createOrder = useCallback(async (orderData) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await orderService.createOrder(orderData);
      
      if (result.success) {
        // Refresh the list
        await fetchUserOrders();
      } else {
        setError(result.message);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'خطأ في إنشاء الطلب';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [fetchUserOrders]);

  /**
   * Update order
   * @param {number} orderId - Order ID
   * @param {Object} orderData - Updated order data
   * @returns {Promise<Object>} Update result
   */
  const updateOrder = useCallback(async (orderId, orderData) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await orderService.updateOrder(orderId, orderData);
      
      if (result.success) {
        // Update the order in the list
        setOrders(prev => prev.map(order => 
          order.id === orderId ? { ...order, ...result.data } : order
        ));
      } else {
        setError(result.message);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'خطأ في تحديث الطلب';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Delete order
   * @param {number} orderId - Order ID
   * @returns {Promise<Object>} Delete result
   */
  const deleteOrder = useCallback(async (orderId) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await orderService.deleteOrder(orderId);
      
      if (result.success) {
        // Remove the order from the list
        setOrders(prev => prev.filter(order => order.id !== orderId));
      } else {
        setError(result.message);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'خطأ في حذف الطلب';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get order details
   * @param {number} orderId - Order ID
   * @returns {Promise<Object>} Order details result
   */
  const getOrderDetails = useCallback(async (orderId) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await orderService.getOrderDetails(orderId);
      
      return result;
    } catch (error) {
      const errorMessage = 'خطأ في جلب تفاصيل الطلب';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Cancel order
   * @param {number} orderId - Order ID
   * @param {string} reason - Cancellation reason
   * @returns {Promise<Object>} Cancel result
   */
  const cancelOrder = useCallback(async (orderId, reason) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await orderService.cancelOrder(orderId, reason);
      
      if (result.success) {
        // Update the order status in the list
        setOrders(prev => prev.map(order => 
          order.id === orderId ? { ...order, status: 'cancelled' } : order
        ));
      } else {
        setError(result.message);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'خطأ في إلغاء الطلب';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get orders by status
   * @param {string} status - Order status
   * @param {Object} params - Additional parameters
   * @returns {Promise<Object>} Orders by status result
   */
  const getOrdersByStatus = useCallback(async (status, params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await orderService.getOrdersByStatus(status, params);
      
      if (result.success) {
        setOrders(result.data);
        setPagination(result.pagination);
      } else {
        setError(result.message);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'خطأ في جلب الطلبات حسب الحالة';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get orders by pharmacy
   * @param {number} pharmacyId - Pharmacy ID
   * @param {Object} params - Additional parameters
   * @returns {Promise<Object>} Orders by pharmacy result
   */
  const getOrdersByPharmacy = useCallback(async (pharmacyId, params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await orderService.getOrdersByPharmacy(pharmacyId, params);
      
      if (result.success) {
        setOrders(result.data);
        setPagination(result.pagination);
      } else {
        setError(result.message);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'خطأ في جلب طلبات الصيدلية';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update order status
   * @param {number} orderId - Order ID
   * @param {string} status - New status
   * @returns {Promise<Object>} Update status result
   */
  const updateOrderStatus = useCallback(async (orderId, status) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await orderService.updateOrderStatus(orderId, status);
      
      if (result.success) {
        // Update the order status in the list
        setOrders(prev => prev.map(order => 
          order.id === orderId ? { ...order, status } : order
        ));
      } else {
        setError(result.message);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'خطأ في تحديث حالة الطلب';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get return orders
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Return orders result
   */
  const getReturnOrders = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await orderService.getReturnOrders(params);
      
      if (result.success) {
        setOrders(result.data);
        setPagination(result.pagination);
      } else {
        setError(result.message);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'خطأ في جلب طلبات الإرجاع';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Return product
   * @param {Object} returnData - Return data
   * @returns {Promise<Object>} Return product result
   */
  const returnProduct = useCallback(async (returnData) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await orderService.returnProduct(returnData);
      
      return result;
    } catch (error) {
      const errorMessage = 'خطأ في إرجاع المنتج';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Refresh orders list
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Refresh result
   */
  const refresh = useCallback(async (params = {}) => {
    try {
      setRefreshing(true);
      setError(null);
      
      const result = await orderService.getUserOrders(params);
      
      if (result.success) {
        setOrders(result.data);
        setPagination(result.pagination);
      } else {
        setError(result.message);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'خطأ في تحديث قائمة الطلبات';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setRefreshing(false);
    }
  }, []);

  /**
   * Load more orders (pagination)
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Load more result
   */
  const loadMore = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await orderService.getUserOrders(params);
      
      if (result.success) {
        setOrders(prev => [...prev, ...result.data]);
        setPagination(result.pagination);
      } else {
        setError(result.message);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'خطأ في تحميل المزيد من الطلبات';
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

  return {
    // State
    orders,
    loading,
    error,
    pagination,
    refreshing,
    
    // Methods
    fetchUserOrders,
    createOrder,
    updateOrder,
    deleteOrder,
    getOrderDetails,
    cancelOrder,
    getOrdersByStatus,
    getOrdersByPharmacy,
    updateOrderStatus,
    getReturnOrders,
    returnProduct,
    refresh,
    loadMore,
    clearError
  };
};
