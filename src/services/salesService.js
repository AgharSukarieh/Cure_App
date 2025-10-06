// Sales Service
import { apiRequest } from '../config/apiConfig';
import API from '../config/apiConfig';

/**
 * Sales Service
 * Handles all sales report-related API calls
 */
class SalesService {
  
  /**
   * Get sales reports
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Sales reports response
   */
  async getSalesReports(params = {}) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: API.sales.reports,
        params
      });

      return {
        success: response.success,
        data: response.data?.data || response.data,
        pagination: response.data?.pagination,
        message: response.success ? 'تم جلب تقارير المبيعات بنجاح' : 'فشل في جلب تقارير المبيعات'
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
   * Add sales report
   * @param {Object} reportData - Report data
   * @returns {Promise<Object>} Add report response
   */
  async addSalesReport(reportData) {
    try {
      const response = await apiRequest({
        method: 'POST',
        url: API.sales.add_report,
        data: reportData
      });

      return {
        success: response.success,
        data: response.data,
        message: response.success ? 'تم إضافة تقرير المبيعات بنجاح' : 'فشل في إضافة تقرير المبيعات',
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
   * Get sales report
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Sales report response
   */
  async getSalesReport(params = {}) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: API.sales.get_report,
        params
      });

      return {
        success: response.success,
        data: response.data,
        message: response.success ? 'تم جلب تقرير المبيعات بنجاح' : 'فشل في جلب تقرير المبيعات'
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
   * Collect money
   * @param {Object} collectionData - Collection data
   * @returns {Promise<Object>} Collect money response
   */
  async collectMoney(collectionData) {
    try {
      const response = await apiRequest({
        method: 'POST',
        url: API.sales.collection,
        data: collectionData
      });

      return {
        success: response.success,
        data: response.data,
        message: response.success ? 'تم تحصيل المال بنجاح' : 'فشل في تحصيل المال',
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
   * Get sales inventory
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Sales inventory response
   */
  async getSalesInventory(params = {}) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: API.sales.inventory,
        params
      });

      return {
        success: response.success,
        data: response.data?.data || response.data,
        pagination: response.data?.pagination,
        message: response.success ? 'تم جلب مخزون المبيعات بنجاح' : 'فشل في جلب مخزون المبيعات'
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
   * Add sales inventory
   * @param {Object} inventoryData - Inventory data
   * @returns {Promise<Object>} Add inventory response
   */
  async addSalesInventory(inventoryData) {
    try {
      const response = await apiRequest({
        method: 'POST',
        url: API.sales.add_inventory,
        data: inventoryData
      });

      return {
        success: response.success,
        data: response.data,
        message: response.success ? 'تم إضافة مخزون المبيعات بنجاح' : 'فشل في إضافة مخزون المبيعات',
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
   * Get last sales order
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Last order response
   */
  async getLastSalesOrder(params = {}) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: API.sales.last_order,
        params
      });

      return {
        success: response.success,
        data: response.data,
        message: response.success ? 'تم جلب آخر طلب مبيعات بنجاح' : 'فشل في جلب آخر طلب مبيعات'
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
   * Get product by barcode
   * @param {string} barcode - Product barcode
   * @returns {Promise<Object>} Product by barcode response
   */
  async getProductByBarcode(barcode) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: API.sales.product_by_barcode,
        params: { barcode }
      });

      return {
        success: response.success,
        data: response.data,
        message: response.success ? 'تم جلب المنتج بالباركود بنجاح' : 'فشل في جلب المنتج بالباركود'
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
   * Get sales pharmacy
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Sales pharmacy response
   */
  async getSalesPharmacy(params = {}) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: API.sales.pharmacy,
        params
      });

      return {
        success: response.success,
        data: response.data?.data || response.data,
        pagination: response.data?.pagination,
        message: response.success ? 'تم جلب صيدلية المبيعات بنجاح' : 'فشل في جلب صيدلية المبيعات'
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
   * Get sales visits
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Sales visits response
   */
  async getSalesVisits(params = {}) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: API.sales.visits,
        params
      });

      return {
        success: response.success,
        data: response.data?.data || response.data,
        pagination: response.data?.pagination,
        message: response.success ? 'تم جلب زيارات المبيعات بنجاح' : 'فشل في جلب زيارات المبيعات'
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
   * Get sales report by ID
   * @param {number} reportId - Report ID
   * @returns {Promise<Object>} Report details response
   */
  async getSalesReportById(reportId) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: `${API.sales.reports}/${reportId}`
      });

      return {
        success: response.success,
        data: response.data,
        message: response.success ? 'تم جلب تفاصيل تقرير المبيعات بنجاح' : 'فشل في جلب تفاصيل تقرير المبيعات'
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
   * Get sales reports by date range
   * @param {string} startDate - Start date
   * @param {string} endDate - End date
   * @param {Object} params - Additional parameters
   * @returns {Promise<Object>} Reports by date range response
   */
  async getSalesReportsByDateRange(startDate, endDate, params = {}) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: API.sales.reports,
        params: {
          start_date: startDate,
          end_date: endDate,
          ...params
        }
      });

      return {
        success: response.success,
        data: response.data?.data || response.data,
        pagination: response.data?.pagination,
        message: response.success ? 'تم جلب تقارير المبيعات حسب الفترة الزمنية بنجاح' : 'فشل في جلب تقارير المبيعات حسب الفترة الزمنية'
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
   * Get sales statistics
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Sales statistics response
   */
  async getSalesStatistics(params = {}) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: `${API.sales.reports}/statistics`,
        params
      });

      return {
        success: response.success,
        data: response.data,
        message: response.success ? 'تم جلب إحصائيات المبيعات بنجاح' : 'فشل في جلب إحصائيات المبيعات'
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
   * Update sales report
   * @param {number} reportId - Report ID
   * @param {Object} reportData - Updated report data
   * @returns {Promise<Object>} Update report response
   */
  async updateSalesReport(reportId, reportData) {
    try {
      const response = await apiRequest({
        method: 'PUT',
        url: `${API.sales.reports}/${reportId}`,
        data: reportData
      });

      return {
        success: response.success,
        data: response.data,
        message: response.success ? 'تم تحديث تقرير المبيعات بنجاح' : 'فشل في تحديث تقرير المبيعات',
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
   * Delete sales report
   * @param {number} reportId - Report ID
   * @returns {Promise<Object>} Delete report response
   */
  async deleteSalesReport(reportId) {
    try {
      const response = await apiRequest({
        method: 'DELETE',
        url: `${API.sales.reports}/${reportId}`
      });

      return {
        success: response.success,
        message: response.success ? 'تم حذف تقرير المبيعات بنجاح' : 'فشل في حذف تقرير المبيعات',
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
   * Get sales visits by pharmacy
   * @param {number} pharmacyId - Pharmacy ID
   * @param {Object} params - Additional parameters
   * @returns {Promise<Object>} Visits by pharmacy response
   */
  async getSalesVisitsByPharmacy(pharmacyId, params = {}) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: API.sales.visits,
        params: {
          pharmacy_id: pharmacyId,
          ...params
        }
      });

      return {
        success: response.success,
        data: response.data?.data || response.data,
        pagination: response.data?.pagination,
        message: response.success ? 'تم جلب زيارات المبيعات حسب الصيدلية بنجاح' : 'فشل في جلب زيارات المبيعات حسب الصيدلية'
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
const salesService = new SalesService();
export default salesService;

// Export individual methods for convenience
export const {
  getSalesReports,
  addSalesReport,
  getSalesReport,
  collectMoney,
  getSalesInventory,
  addSalesInventory,
  getLastSalesOrder,
  getProductByBarcode,
  getSalesPharmacy,
  getSalesVisits,
  getSalesReportById,
  getSalesReportsByDateRange,
  getSalesStatistics,
  updateSalesReport,
  deleteSalesReport,
  getSalesVisitsByPharmacy
} = salesService;
