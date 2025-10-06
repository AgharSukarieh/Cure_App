// Order Service
import { apiRequest } from '../config/apiConfig';
import API from '../config/apiConfig';

/**
 * Order Service
 * Handles all order-related API calls
 */
class OrderService {
  
  /**
   * Get all orders
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Orders list response
   */
  async getOrders(params = {}) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: API.orders.orders,
        params
      });

      return {
        success: response.success,
        data: response.data?.data || response.data,
        pagination: response.data?.pagination,
        message: response.success ? 'تم جلب قائمة الطلبات بنجاح' : 'فشل في جلب قائمة الطلبات'
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
   * Create new order
   * @param {Object} orderData - Order data
   * @returns {Promise<Object>} Create order response
   */
  async createOrder(orderData) {
    try {
      const response = await apiRequest({
        method: 'POST',
        url: API.orders.orders,
        data: orderData
      });

      return {
        success: response.success,
        data: response.data,
        message: response.success ? 'تم إنشاء الطلب بنجاح' : 'فشل في إنشاء الطلب',
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
   * Update order
   * @param {number} orderId - Order ID
   * @param {Object} orderData - Updated order data
   * @returns {Promise<Object>} Update order response
   */
  async updateOrder(orderId, orderData) {
    try {
      const response = await apiRequest({
        method: 'PUT',
        url: `${API.orders.orders}/${orderId}`,
        data: orderData
      });

      return {
        success: response.success,
        data: response.data,
        message: response.success ? 'تم تحديث الطلب بنجاح' : 'فشل في تحديث الطلب',
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
   * Delete order
   * @param {number} orderId - Order ID
   * @returns {Promise<Object>} Delete order response
   */
  async deleteOrder(orderId) {
    try {
      const response = await apiRequest({
        method: 'DELETE',
        url: `${API.orders.orders}/${orderId}`
      });

      return {
        success: response.success,
        message: response.success ? 'تم حذف الطلب بنجاح' : 'فشل في حذف الطلب',
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
   * Get user orders
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} User orders response
   */
  async getUserOrders(params = {}) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: API.orders.user_orders,
        params
      });

      return {
        success: response.success,
        data: response.data?.data || response.data,
        pagination: response.data?.pagination,
        message: response.success ? 'تم جلب طلباتك بنجاح' : 'فشل في جلب طلباتك'
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
   * Get sales orders
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Sales orders response
   */
  async getSalesOrders(params = {}) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: API.orders.sales_orders,
        params
      });

      return {
        success: response.success,
        data: response.data?.data || response.data,
        pagination: response.data?.pagination,
        message: response.success ? 'تم جلب طلبات المبيعات بنجاح' : 'فشل في جلب طلبات المبيعات'
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
   * Get order details
   * @param {number} orderId - Order ID
   * @returns {Promise<Object>} Order details response
   */
  async getOrderDetails(orderId) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: `${API.orders.order_details}${orderId}`
      });

      return {
        success: response.success,
        data: response.data,
        message: response.success ? 'تم جلب تفاصيل الطلب بنجاح' : 'فشل في جلب تفاصيل الطلب'
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
   * Get last order for pharmacy
   * @param {number} pharmacyId - Pharmacy ID
   * @returns {Promise<Object>} Last order response
   */
  async getLastOrderPharmacy(pharmacyId) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: API.orders.last_order_pharmacy,
        params: { pharmacy_id: pharmacyId }
      });

      return {
        success: response.success,
        data: response.data,
        message: response.success ? 'تم جلب آخر طلب للصيدلية بنجاح' : 'فشل في جلب آخر طلب للصيدلية'
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
   * Get return orders
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Return orders response
   */
  async getReturnOrders(params = {}) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: API.orders.return_orders,
        params
      });

      return {
        success: response.success,
        data: response.data?.data || response.data,
        pagination: response.data?.pagination,
        message: response.success ? 'تم جلب طلبات الإرجاع بنجاح' : 'فشل في جلب طلبات الإرجاع'
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
   * Return product
   * @param {Object} returnData - Return data
   * @returns {Promise<Object>} Return product response
   */
  async returnProduct(returnData) {
    try {
      const response = await apiRequest({
        method: 'POST',
        url: API.orders.return_product,
        data: returnData
      });

      return {
        success: response.success,
        data: response.data,
        message: response.success ? 'تم إرجاع المنتج بنجاح' : 'فشل في إرجاع المنتج',
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
   * Get orders by status
   * @param {string} status - Order status
   * @param {Object} params - Additional parameters
   * @returns {Promise<Object>} Orders by status response
   */
  async getOrdersByStatus(status, params = {}) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: API.orders.orders,
        params: {
          status,
          ...params
        }
      });

      return {
        success: response.success,
        data: response.data?.data || response.data,
        pagination: response.data?.pagination,
        message: response.success ? 'تم جلب الطلبات حسب الحالة بنجاح' : 'فشل في جلب الطلبات حسب الحالة'
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
   * Get orders by pharmacy
   * @param {number} pharmacyId - Pharmacy ID
   * @param {Object} params - Additional parameters
   * @returns {Promise<Object>} Orders by pharmacy response
   */
  async getOrdersByPharmacy(pharmacyId, params = {}) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: API.orders.orders,
        params: {
          pharmacy_id: pharmacyId,
          ...params
        }
      });

      return {
        success: response.success,
        data: response.data?.data || response.data,
        pagination: response.data?.pagination,
        message: response.success ? 'تم جلب طلبات الصيدلية بنجاح' : 'فشل في جلب طلبات الصيدلية'
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
   * Update order status
   * @param {number} orderId - Order ID
   * @param {string} status - New status
   * @returns {Promise<Object>} Update status response
   */
  async updateOrderStatus(orderId, status) {
    try {
      const response = await apiRequest({
        method: 'PUT',
        url: `${API.orders.orders}/${orderId}/status`,
        data: { status }
      });

      return {
        success: response.success,
        data: response.data,
        message: response.success ? 'تم تحديث حالة الطلب بنجاح' : 'فشل في تحديث حالة الطلب',
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
   * Get order statistics
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Order statistics response
   */
  async getOrderStatistics(params = {}) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: `${API.orders.orders}/statistics`,
        params
      });

      return {
        success: response.success,
        data: response.data,
        message: response.success ? 'تم جلب إحصائيات الطلبات بنجاح' : 'فشل في جلب إحصائيات الطلبات'
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
   * Cancel order
   * @param {number} orderId - Order ID
   * @param {string} reason - Cancellation reason
   * @returns {Promise<Object>} Cancel order response
   */
  async cancelOrder(orderId, reason) {
    try {
      const response = await apiRequest({
        method: 'PUT',
        url: `${API.orders.orders}/${orderId}/cancel`,
        data: { reason }
      });

      return {
        success: response.success,
        data: response.data,
        message: response.success ? 'تم إلغاء الطلب بنجاح' : 'فشل في إلغاء الطلب',
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
const orderService = new OrderService();
export default orderService;

// Export individual methods for convenience
export const {
  getOrders,
  createOrder,
  updateOrder,
  deleteOrder,
  getUserOrders,
  getSalesOrders,
  getOrderDetails,
  getLastOrderPharmacy,
  getReturnOrders,
  returnProduct,
  getOrdersByStatus,
  getOrdersByPharmacy,
  updateOrderStatus,
  getOrderStatistics,
  cancelOrder
} = orderService;
