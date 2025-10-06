// Pharmacy Service
import { apiRequest } from '../config/apiConfig';
import API from '../config/apiConfig';

/**
 * Pharmacy Service
 * Handles all pharmacy-related API calls
 */
class PharmacyService {
  
  /**
   * Get all pharmacies (public)
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Pharmacies list response
   */
  async getPharmacies(params = {}) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: API.pharmacy.list,
        params
      });

      return {
        success: response.success,
        data: response.data?.data || response.data,
        pagination: response.data?.pagination,
        message: response.success ? 'تم جلب قائمة الصيدليات بنجاح' : 'فشل في جلب قائمة الصيدليات'
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
   * Get user's pharmacies
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} User's pharmacies response
   */
  async getUserPharmacies(params = {}) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: API.pharmacy.user_pharmacies,
        params
      });

      return {
        success: response.success,
        data: response.data?.data || response.data,
        pagination: response.data?.pagination,
        message: response.success ? 'تم جلب صيدلياتك بنجاح' : 'فشل في جلب صيدلياتك'
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
   * Create new pharmacy
   * @param {Object} pharmacyData - Pharmacy data
   * @returns {Promise<Object>} Create pharmacy response
   */
  async createPharmacy(pharmacyData) {
    try {
      const response = await apiRequest({
        method: 'POST',
        url: API.pharmacy.create_pharmacy,
        data: pharmacyData
      });

      return {
        success: response.success,
        data: response.data,
        message: response.success ? 'تم إنشاء الصيدلية بنجاح' : 'فشل في إنشاء الصيدلية',
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
   * Create pharmacy (mobile version)
   * @param {Object} pharmacyData - Pharmacy data
   * @returns {Promise<Object>} Create pharmacy response
   */
  async createPharmacyMobile(pharmacyData) {
    try {
      const response = await apiRequest({
        method: 'POST',
        url: API.pharmacy.create_pharmacy_mobile,
        data: pharmacyData
      });

      return {
        success: response.success,
        data: response.data,
        message: response.success ? 'تم إنشاء الصيدلية بنجاح' : 'فشل في إنشاء الصيدلية',
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
   * Update pharmacy
   * @param {number} pharmacyId - Pharmacy ID
   * @param {Object} pharmacyData - Updated pharmacy data
   * @returns {Promise<Object>} Update pharmacy response
   */
  async updatePharmacy(pharmacyId, pharmacyData) {
    try {
      const response = await apiRequest({
        method: 'PUT',
        url: `${API.pharmacy.update_pharmacy}/${pharmacyId}`,
        data: pharmacyData
      });

      return {
        success: response.success,
        data: response.data,
        message: response.success ? 'تم تحديث الصيدلية بنجاح' : 'فشل في تحديث الصيدلية',
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
   * Delete pharmacy
   * @param {number} pharmacyId - Pharmacy ID
   * @returns {Promise<Object>} Delete pharmacy response
   */
  async deletePharmacy(pharmacyId) {
    try {
      const response = await apiRequest({
        method: 'DELETE',
        url: `${API.pharmacy.delete_pharmacy}/${pharmacyId}`
      });

      return {
        success: response.success,
        message: response.success ? 'تم حذف الصيدلية بنجاح' : 'فشل في حذف الصيدلية',
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
   * Get pharmacy by ID
   * @param {number} pharmacyId - Pharmacy ID
   * @returns {Promise<Object>} Pharmacy details response
   */
  async getPharmacyById(pharmacyId) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: `${API.pharmacy.list}/${pharmacyId}`
      });

      return {
        success: response.success,
        data: response.data,
        message: response.success ? 'تم جلب بيانات الصيدلية بنجاح' : 'فشل في جلب بيانات الصيدلية'
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
   * Add pharmacy image
   * @param {FormData} imageData - Image data
   * @returns {Promise<Object>} Add image response
   */
  async addPharmacyImage(imageData) {
    try {
      const response = await apiRequest({
        method: 'POST',
        url: API.pharmacy.add_image,
        data: imageData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return {
        success: response.success,
        data: response.data,
        message: response.success ? 'تم رفع صورة الصيدلية بنجاح' : 'فشل في رفع صورة الصيدلية',
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
   * Update pharmacy image
   * @param {number} pharmacyId - Pharmacy ID
   * @param {FormData} imageData - Image data
   * @returns {Promise<Object>} Update image response
   */
  async updatePharmacyImage(pharmacyId, imageData) {
    try {
      const response = await apiRequest({
        method: 'PUT',
        url: API.pharmacy.update_image,
        data: {
          pharmacy_id: pharmacyId,
          ...imageData
        },
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return {
        success: response.success,
        data: response.data,
        message: response.success ? 'تم تحديث صورة الصيدلية بنجاح' : 'فشل في تحديث صورة الصيدلية',
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
   * Get pharmacy cities
   * @returns {Promise<Object>} Cities response
   */
  async getPharmacyCities() {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: API.pharmacy.cities
      });

      return {
        success: response.success,
        data: response.data?.data || response.data,
        message: response.success ? 'تم جلب مدن الصيدليات بنجاح' : 'فشل في جلب مدن الصيدليات'
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
   * Get pharmacy areas by city
   * @param {number} cityId - City ID
   * @returns {Promise<Object>} Areas response
   */
  async getPharmacyAreas(cityId) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: `${API.pharmacy.areas}${cityId}`
      });

      return {
        success: response.success,
        data: response.data?.data || response.data,
        message: response.success ? 'تم جلب مناطق الصيدليات بنجاح' : 'فشل في جلب مناطق الصيدليات'
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
   * Search pharmacies
   * @param {Object} searchParams - Search parameters
   * @returns {Promise<Object>} Search results response
   */
  async searchPharmacies(searchParams) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: API.pharmacy.list,
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
   * Get pharmacies by city
   * @param {number} cityId - City ID
   * @param {Object} params - Additional parameters
   * @returns {Promise<Object>} Pharmacies by city response
   */
  async getPharmaciesByCity(cityId, params = {}) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: API.pharmacy.list,
        params: {
          city_id: cityId,
          ...params
        }
      });

      return {
        success: response.success,
        data: response.data?.data || response.data,
        pagination: response.data?.pagination,
        message: response.success ? 'تم جلب الصيدليات حسب المدينة بنجاح' : 'فشل في جلب الصيدليات حسب المدينة'
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
   * Get pharmacies by area
   * @param {number} areaId - Area ID
   * @param {Object} params - Additional parameters
   * @returns {Promise<Object>} Pharmacies by area response
   */
  async getPharmaciesByArea(areaId, params = {}) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: API.pharmacy.list,
        params: {
          area_id: areaId,
          ...params
        }
      });

      return {
        success: response.success,
        data: response.data?.data || response.data,
        pagination: response.data?.pagination,
        message: response.success ? 'تم جلب الصيدليات حسب المنطقة بنجاح' : 'فشل في جلب الصيدليات حسب المنطقة'
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
   * Get nearby pharmacies
   * @param {number} latitude - Latitude
   * @param {number} longitude - Longitude
   * @param {number} radius - Search radius in kilometers
   * @returns {Promise<Object>} Nearby pharmacies response
   */
  async getNearbyPharmacies(latitude, longitude, radius = 10) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: API.pharmacy.list,
        params: {
          latitude,
          longitude,
          radius
        }
      });

      return {
        success: response.success,
        data: response.data?.data || response.data,
        message: response.success ? 'تم جلب الصيدليات القريبة بنجاح' : 'فشل في جلب الصيدليات القريبة'
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
   * Get pharmacy statistics
   * @param {number} pharmacyId - Pharmacy ID
   * @returns {Promise<Object>} Pharmacy statistics response
   */
  async getPharmacyStatistics(pharmacyId) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: `${API.pharmacy.list}/${pharmacyId}/statistics`
      });

      return {
        success: response.success,
        data: response.data,
        message: response.success ? 'تم جلب إحصائيات الصيدلية بنجاح' : 'فشل في جلب إحصائيات الصيدلية'
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
   * Get pharmacy products
   * @param {number} pharmacyId - Pharmacy ID
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Pharmacy products response
   */
  async getPharmacyProducts(pharmacyId, params = {}) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: `${API.pharmacy.list}/${pharmacyId}/products`,
        params
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
   * Get pharmacy orders
   * @param {number} pharmacyId - Pharmacy ID
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Pharmacy orders response
   */
  async getPharmacyOrders(pharmacyId, params = {}) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: `${API.pharmacy.list}/${pharmacyId}/orders`,
        params
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
}

// Create and export service instance
const pharmacyService = new PharmacyService();
export default pharmacyService;

// Export individual methods for convenience
export const {
  getPharmacies,
  getUserPharmacies,
  createPharmacy,
  createPharmacyMobile,
  updatePharmacy,
  deletePharmacy,
  getPharmacyById,
  addPharmacyImage,
  updatePharmacyImage,
  getPharmacyCities,
  getPharmacyAreas,
  searchPharmacies,
  getPharmaciesByCity,
  getPharmaciesByArea,
  getNearbyPharmacies,
  getPharmacyStatistics,
  getPharmacyProducts,
  getPharmacyOrders
} = pharmacyService;
