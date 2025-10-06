// Doctor Service
import { apiRequest } from '../config/apiConfig';
import API from '../config/apiConfig';

/**
 * Doctor Service
 * Handles all doctor-related API calls
 */
class DoctorService {
  
  /**
   * Get all doctors (public)
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Doctors list response
   */
  async getDoctors(params = {}) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: API.doctor.doctors,
        params
      });

      return {
        success: response.success,
        data: response.data?.data || response.data,
        pagination: response.data?.pagination,
        message: response.success ? 'تم جلب قائمة الأطباء بنجاح' : 'فشل في جلب قائمة الأطباء'
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
   * Get user's doctors
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} User's doctors response
   */
  async getUserDoctors(params = {}) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: API.doctor.user_doctors,
        params
      });

      return {
        success: response.success,
        data: response.data?.data || response.data,
        pagination: response.data?.pagination,
        message: response.success ? 'تم جلب أطبائك بنجاح' : 'فشل في جلب أطبائك'
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
   * Create new doctor
   * @param {Object} doctorData - Doctor data
   * @returns {Promise<Object>} Create doctor response
   */
  async createDoctor(doctorData) {
    try {
      const response = await apiRequest({
        method: 'POST',
        url: API.doctor.create_doctor,
        data: doctorData
      });

      return {
        success: response.success,
        data: response.data,
        message: response.success ? 'تم إنشاء الطبيب بنجاح' : 'فشل في إنشاء الطبيب',
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
   * Create doctor (mobile version)
   * @param {Object} doctorData - Doctor data
   * @returns {Promise<Object>} Create doctor response
   */
  async createDoctorMobile(doctorData) {
    try {
      const response = await apiRequest({
        method: 'POST',
        url: API.doctor.create_doctor_mobile,
        data: doctorData
      });

      return {
        success: response.success,
        data: response.data,
        message: response.success ? 'تم إنشاء الطبيب بنجاح' : 'فشل في إنشاء الطبيب',
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
   * Update doctor
   * @param {number} doctorId - Doctor ID
   * @param {Object} doctorData - Updated doctor data
   * @returns {Promise<Object>} Update doctor response
   */
  async updateDoctor(doctorId, doctorData) {
    try {
      const response = await apiRequest({
        method: 'PUT',
        url: `${API.doctor.update_doctor}/${doctorId}`,
        data: doctorData
      });

      return {
        success: response.success,
        data: response.data,
        message: response.success ? 'تم تحديث الطبيب بنجاح' : 'فشل في تحديث الطبيب',
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
   * Delete doctor
   * @param {number} doctorId - Doctor ID
   * @returns {Promise<Object>} Delete doctor response
   */
  async deleteDoctor(doctorId) {
    try {
      const response = await apiRequest({
        method: 'DELETE',
        url: `${API.doctor.delete_doctor}/${doctorId}`
      });

      return {
        success: response.success,
        message: response.success ? 'تم حذف الطبيب بنجاح' : 'فشل في حذف الطبيب',
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
   * Get doctor by ID
   * @param {number} doctorId - Doctor ID
   * @returns {Promise<Object>} Doctor details response
   */
  async getDoctorById(doctorId) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: `${API.doctor.doctors}/${doctorId}`
      });

      return {
        success: response.success,
        data: response.data,
        message: response.success ? 'تم جلب بيانات الطبيب بنجاح' : 'فشل في جلب بيانات الطبيب'
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
   * Get doctor specialties
   * @returns {Promise<Object>} Specialties response
   */
  async getSpecialties() {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: API.doctor.speciality
      });

      return {
        success: response.success,
        data: response.data?.data || response.data,
        message: response.success ? 'تم جلب التخصصات بنجاح' : 'فشل في جلب التخصصات'
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
   * Get doctor cities
   * @returns {Promise<Object>} Cities response
   */
  async getDoctorCities() {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: API.doctor.cities
      });

      return {
        success: response.success,
        data: response.data?.data || response.data,
        message: response.success ? 'تم جلب المدن بنجاح' : 'فشل في جلب المدن'
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
   * Get doctor areas by city
   * @param {number} cityId - City ID
   * @returns {Promise<Object>} Areas response
   */
  async getDoctorAreas(cityId) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: `${API.doctor.areas}${cityId}`
      });

      return {
        success: response.success,
        data: response.data?.data || response.data,
        message: response.success ? 'تم جلب المناطق بنجاح' : 'فشل في جلب المناطق'
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
   * Get doctor specialty areas
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Specialty areas response
   */
  async getSpecialtyAreas(params = {}) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: API.doctor.speciality_area,
        params
      });

      return {
        success: response.success,
        data: response.data?.data || response.data,
        message: response.success ? 'تم جلب مناطق التخصص بنجاح' : 'فشل في جلب مناطق التخصص'
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
   * Search doctors
   * @param {Object} searchParams - Search parameters
   * @returns {Promise<Object>} Search results response
   */
  async searchDoctors(searchParams) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: API.doctor.doctors,
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
   * Get doctors by specialty
   * @param {number} specialtyId - Specialty ID
   * @param {Object} params - Additional parameters
   * @returns {Promise<Object>} Doctors by specialty response
   */
  async getDoctorsBySpecialty(specialtyId, params = {}) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: API.doctor.doctors,
        params: {
          specialty_id: specialtyId,
          ...params
        }
      });

      return {
        success: response.success,
        data: response.data?.data || response.data,
        pagination: response.data?.pagination,
        message: response.success ? 'تم جلب الأطباء حسب التخصص بنجاح' : 'فشل في جلب الأطباء حسب التخصص'
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
   * Get doctors by city
   * @param {number} cityId - City ID
   * @param {Object} params - Additional parameters
   * @returns {Promise<Object>} Doctors by city response
   */
  async getDoctorsByCity(cityId, params = {}) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: API.doctor.doctors,
        params: {
          city_id: cityId,
          ...params
        }
      });

      return {
        success: response.success,
        data: response.data?.data || response.data,
        pagination: response.data?.pagination,
        message: response.success ? 'تم جلب الأطباء حسب المدينة بنجاح' : 'فشل في جلب الأطباء حسب المدينة'
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
   * Get doctors by area
   * @param {number} areaId - Area ID
   * @param {Object} params - Additional parameters
   * @returns {Promise<Object>} Doctors by area response
   */
  async getDoctorsByArea(areaId, params = {}) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: API.doctor.doctors,
        params: {
          area_id: areaId,
          ...params
        }
      });

      return {
        success: response.success,
        data: response.data?.data || response.data,
        pagination: response.data?.pagination,
        message: response.success ? 'تم جلب الأطباء حسب المنطقة بنجاح' : 'فشل في جلب الأطباء حسب المنطقة'
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
   * Get doctor statistics
   * @param {number} doctorId - Doctor ID
   * @returns {Promise<Object>} Doctor statistics response
   */
  async getDoctorStatistics(doctorId) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: `${API.doctor.doctors}/${doctorId}/statistics`
      });

      return {
        success: response.success,
        data: response.data,
        message: response.success ? 'تم جلب إحصائيات الطبيب بنجاح' : 'فشل في جلب إحصائيات الطبيب'
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
const doctorService = new DoctorService();
export default doctorService;

// Export individual methods for convenience
export const {
  getDoctors,
  getUserDoctors,
  createDoctor,
  createDoctorMobile,
  updateDoctor,
  deleteDoctor,
  getDoctorById,
  getSpecialties,
  getDoctorCities,
  getDoctorAreas,
  getSpecialtyAreas,
  searchDoctors,
  getDoctorsBySpecialty,
  getDoctorsByCity,
  getDoctorsByArea,
  getDoctorStatistics
} = doctorService;
