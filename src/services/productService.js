// Product Service
import { apiRequest } from '../config/apiConfig';
import API from '../config/apiConfig';

/**
 * Product Service
 * Handles all product-related API calls
 */
class ProductService {
  
  /**
   * Get all products (public)
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Products list response
   */
  async getProducts(params = {}) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: API.product.products,
        params
      });

      return {
        success: response.success,
        data: response.data?.data || response.data,
        pagination: response.data?.pagination,
        message: response.success ? 'تم جلب قائمة المنتجات بنجاح' : 'فشل في جلب قائمة المنتجات'
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
   * Get user's products
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} User's products response
   */
  async getUserProducts(params = {}) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: API.product.user_products,
        params
      });

      return {
        success: response.success,
        data: response.data?.data || response.data,
        pagination: response.data?.pagination,
        message: response.success ? 'تم جلب منتجاتك بنجاح' : 'فشل في جلب منتجاتك'
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
   * Create new product
   * @param {Object} productData - Product data
   * @returns {Promise<Object>} Create product response
   */
  async createProduct(productData) {
    try {
      const response = await apiRequest({
        method: 'POST',
        url: API.product.create_product,
        data: productData
      });

      return {
        success: response.success,
        data: response.data,
        message: response.success ? 'تم إنشاء المنتج بنجاح' : 'فشل في إنشاء المنتج',
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
   * Update product
   * @param {number} productId - Product ID
   * @param {Object} productData - Updated product data
   * @returns {Promise<Object>} Update product response
   */
  async updateProduct(productId, productData) {
    try {
      const response = await apiRequest({
        method: 'PUT',
        url: `${API.product.update_product}/${productId}`,
        data: productData
      });

      return {
        success: response.success,
        data: response.data,
        message: response.success ? 'تم تحديث المنتج بنجاح' : 'فشل في تحديث المنتج',
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
   * Delete product
   * @param {number} productId - Product ID
   * @returns {Promise<Object>} Delete product response
   */
  async deleteProduct(productId) {
    try {
      const response = await apiRequest({
        method: 'DELETE',
        url: `${API.product.delete_product}/${productId}`
      });

      return {
        success: response.success,
        message: response.success ? 'تم حذف المنتج بنجاح' : 'فشل في حذف المنتج',
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
   * Get product by ID
   * @param {number} productId - Product ID
   * @returns {Promise<Object>} Product details response
   */
  async getProductById(productId) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: `${API.product.products}/${productId}`
      });

      return {
        success: response.success,
        data: response.data,
        message: response.success ? 'تم جلب بيانات المنتج بنجاح' : 'فشل في جلب بيانات المنتج'
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
   * Get sample products
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Sample products response
   */
  async getSampleProducts(params = {}) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: API.product.sample_products,
        params
      });

      return {
        success: response.success,
        data: response.data?.data || response.data,
        pagination: response.data?.pagination,
        message: response.success ? 'تم جلب المنتجات النموذجية بنجاح' : 'فشل في جلب المنتجات النموذجية'
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
   * Scan barcode
   * @param {string} barcode - Barcode to scan
   * @returns {Promise<Object>} Barcode scan response
   */
  async scanBarcode(barcode) {
    try {
      const response = await apiRequest({
        method: 'POST',
        url: API.product.scan_barcode,
        data: { barcode }
      });

      return {
        success: response.success,
        data: response.data,
        message: response.success ? 'تم مسح الباركود بنجاح' : 'فشل في مسح الباركود',
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
   * Search products
   * @param {Object} searchParams - Search parameters
   * @returns {Promise<Object>} Search results response
   */
  async searchProducts(searchParams) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: API.product.products,
        params: searchParams
      });

      return {
        success: response.success,
        data: response.data?.data || response.data,
        pagination: response.data?.pagination,
        message: response.success ? 'تم البحث بنجاح' : 'فشل في البحث'
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
   * Get products by category
   * @param {number} categoryId - Category ID
   * @param {Object} params - Additional parameters
   * @returns {Promise<Object>} Products by category response
   */
  async getProductsByCategory(categoryId, params = {}) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: API.product.products,
        params: {
          category_id: categoryId,
          ...params
        }
      });

      return {
        success: response.success,
        data: response.data?.data || response.data,
        pagination: response.data?.pagination,
        message: response.success ? 'تم جلب المنتجات حسب الفئة بنجاح' : 'فشل في جلب المنتجات حسب الفئة'
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
   * Get products by pharmacy
   * @param {number} pharmacyId - Pharmacy ID
   * @param {Object} params - Additional parameters
   * @returns {Promise<Object>} Products by pharmacy response
   */
  async getProductsByPharmacy(pharmacyId, params = {}) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: API.product.products,
        params: {
          pharmacy_id: pharmacyId,
          ...params
        }
      });

      return {
        success: response.success,
        data: response.data?.data || response.data,
        pagination: response.data?.pagination,
        message: response.success ? 'تم جلب منتجات الصيدلية بنجاح' : 'فشل في جلب منتجات الصيدلية'
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
   * Get product statistics
   * @param {number} productId - Product ID
   * @returns {Promise<Object>} Product statistics response
   */
  async getProductStatistics(productId) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: `${API.product.products}/${productId}/statistics`
      });

      return {
        success: response.success,
        data: response.data,
        message: response.success ? 'تم جلب إحصائيات المنتج بنجاح' : 'فشل في جلب إحصائيات المنتج'
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
   * Get product categories
   * @returns {Promise<Object>} Categories response
   */
  async getProductCategories() {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: `${API.product.products}/categories`
      });

      return {
        success: response.success,
        data: response.data?.data || response.data,
        message: response.success ? 'تم جلب فئات المنتجات بنجاح' : 'فشل في جلب فئات المنتجات'
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
   * Get low stock products
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Low stock products response
   */
  async getLowStockProducts(params = {}) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: `${API.product.user_products}/low-stock`,
        params
      });

      return {
        success: response.success,
        data: response.data?.data || response.data,
        pagination: response.data?.pagination,
        message: response.success ? 'تم جلب المنتجات قليلة المخزون بنجاح' : 'فشل في جلب المنتجات قليلة المخزون'
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
   * Update product stock
   * @param {number} productId - Product ID
   * @param {number} quantity - New quantity
   * @returns {Promise<Object>} Update stock response
   */
  async updateProductStock(productId, quantity) {
    try {
      const response = await apiRequest({
        method: 'PUT',
        url: `${API.product.update_product}/${productId}/stock`,
        data: { quantity }
      });

      return {
        success: response.success,
        data: response.data,
        message: response.success ? 'تم تحديث مخزون المنتج بنجاح' : 'فشل في تحديث مخزون المنتج',
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
const productService = new ProductService();
export default productService;

// Export individual methods for convenience
export const {
  getProducts,
  getUserProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  getSampleProducts,
  scanBarcode,
  searchProducts,
  getProductsByCategory,
  getProductsByPharmacy,
  getProductStatistics,
  getProductCategories,
  getLowStockProducts,
  updateProductStock
} = productService;
