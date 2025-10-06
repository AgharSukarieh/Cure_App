// Medical Service
import { apiRequest } from '../config/apiConfig';
import API from '../config/apiConfig';

/**
 * Medical Service
 * Handles all medical report-related API calls
 */
class MedicalService {
  
  /**
   * Get medical reports
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Medical reports response
   */
  async getMedicalReports(params = {}) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: API.medical.reports,
        params
      });

      return {
        success: response.success,
        data: response.data?.data || response.data,
        pagination: response.data?.pagination,
        message: response.success ? 'تم جلب التقارير الطبية بنجاح' : 'فشل في جلب التقارير الطبية'
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
   * Add daily medical report
   * @param {Object} reportData - Report data
   * @returns {Promise<Object>} Add report response
   */
  async addDailyReport(reportData) {
    try {
      const response = await apiRequest({
        method: 'POST',
        url: API.medical.add_daily_report,
        data: reportData
      });

      return {
        success: response.success,
        data: response.data,
        message: response.success ? 'تم إضافة التقرير اليومي بنجاح' : 'فشل في إضافة التقرير اليومي',
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
   * Edit daily medical report
   * @param {Object} reportData - Updated report data
   * @returns {Promise<Object>} Edit report response
   */
  async editDailyReport(reportData) {
    try {
      const response = await apiRequest({
        method: 'POST',
        url: API.medical.edit_daily_report,
        data: reportData
      });

      return {
        success: response.success,
        data: response.data,
        message: response.success ? 'تم تعديل التقرير اليومي بنجاح' : 'فشل في تعديل التقرير اليومي',
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
   * Get daily medical report
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Daily report response
   */
  async getDailyReport(params = {}) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: API.medical.get_daily_report,
        params
      });

      return {
        success: response.success,
        data: response.data,
        message: response.success ? 'تم جلب التقرير اليومي بنجاح' : 'فشل في جلب التقرير اليومي'
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
   * Add daily schedule
   * @param {Object} scheduleData - Schedule data
   * @returns {Promise<Object>} Add schedule response
   */
  async addDailySchedule(scheduleData) {
    try {
      const response = await apiRequest({
        method: 'POST',
        url: API.medical.add_daily_schedule,
        data: scheduleData
      });

      return {
        success: response.success,
        data: response.data,
        message: response.success ? 'تم إضافة الجدول اليومي بنجاح' : 'فشل في إضافة الجدول اليومي',
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
   * Get daily schedule
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Daily schedule response
   */
  async getDailySchedule(params = {}) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: API.medical.get_daily_schedule,
        params
      });

      return {
        success: response.success,
        data: response.data,
        message: response.success ? 'تم جلب الجدول اليومي بنجاح' : 'فشل في جلب الجدول اليومي'
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
   * Get frequency visits
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Frequency visits response
   */
  async getFrequencyVisits(params = {}) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: API.medical.frequency_visits,
        params
      });

      return {
        success: response.success,
        data: response.data?.data || response.data,
        pagination: response.data?.pagination,
        message: response.success ? 'تم جلب زيارات التكرار بنجاح' : 'فشل في جلب زيارات التكرار'
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
   * Get medical visits
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Medical visits response
   */
  async getMedicalVisits(params = {}) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: API.medical.visits,
        params
      });

      return {
        success: response.success,
        data: response.data?.data || response.data,
        pagination: response.data?.pagination,
        message: response.success ? 'تم جلب الزيارات الطبية بنجاح' : 'فشل في جلب الزيارات الطبية'
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
   * Get medical clients
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Medical clients response
   */
  async getMedicalClients(params = {}) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: API.medical.med_client,
        params
      });

      return {
        success: response.success,
        data: response.data?.data || response.data,
        pagination: response.data?.pagination,
        message: response.success ? 'تم جلب العملاء الطبيين بنجاح' : 'فشل في جلب العملاء الطبيين'
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
   * Get client doctors
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Client doctors response
   */
  async getClientDoctors(params = {}) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: API.medical.client_doctor,
        params
      });

      return {
        success: response.success,
        data: response.data?.data || response.data,
        pagination: response.data?.pagination,
        message: response.success ? 'تم جلب أطباء العميل بنجاح' : 'فشل في جلب أطباء العميل'
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
   * Get medical report by ID
   * @param {number} reportId - Report ID
   * @returns {Promise<Object>} Report details response
   */
  async getMedicalReportById(reportId) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: `${API.medical.reports}/${reportId}`
      });

      return {
        success: response.success,
        data: response.data,
        message: response.success ? 'تم جلب تفاصيل التقرير الطبي بنجاح' : 'فشل في جلب تفاصيل التقرير الطبي'
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
   * Get medical reports by date range
   * @param {string} startDate - Start date
   * @param {string} endDate - End date
   * @param {Object} params - Additional parameters
   * @returns {Promise<Object>} Reports by date range response
   */
  async getMedicalReportsByDateRange(startDate, endDate, params = {}) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: API.medical.reports,
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
        message: response.success ? 'تم جلب التقارير حسب الفترة الزمنية بنجاح' : 'فشل في جلب التقارير حسب الفترة الزمنية'
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
   * Get medical statistics
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Medical statistics response
   */
  async getMedicalStatistics(params = {}) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: `${API.medical.reports}/statistics`,
        params
      });

      return {
        success: response.success,
        data: response.data,
        message: response.success ? 'تم جلب الإحصائيات الطبية بنجاح' : 'فشل في جلب الإحصائيات الطبية'
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
   * Delete medical report
   * @param {number} reportId - Report ID
   * @returns {Promise<Object>} Delete report response
   */
  async deleteMedicalReport(reportId) {
    try {
      const response = await apiRequest({
        method: 'DELETE',
        url: `${API.medical.reports}/${reportId}`
      });

      return {
        success: response.success,
        message: response.success ? 'تم حذف التقرير الطبي بنجاح' : 'فشل في حذف التقرير الطبي',
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
   * Get medical visits by doctor
   * @param {number} doctorId - Doctor ID
   * @param {Object} params - Additional parameters
   * @returns {Promise<Object>} Visits by doctor response
   */
  async getMedicalVisitsByDoctor(doctorId, params = {}) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: API.medical.visits,
        params: {
          doctor_id: doctorId,
          ...params
        }
      });

      return {
        success: response.success,
        data: response.data?.data || response.data,
        pagination: response.data?.pagination,
        message: response.success ? 'تم جلب الزيارات حسب الطبيب بنجاح' : 'فشل في جلب الزيارات حسب الطبيب'
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
const medicalService = new MedicalService();
export default medicalService;

// Export individual methods for convenience
export const {
  getMedicalReports,
  addDailyReport,
  editDailyReport,
  getDailyReport,
  addDailySchedule,
  getDailySchedule,
  getFrequencyVisits,
  getMedicalVisits,
  getMedicalClients,
  getClientDoctors,
  getMedicalReportById,
  getMedicalReportsByDateRange,
  getMedicalStatistics,
  deleteMedicalReport,
  getMedicalVisitsByDoctor
} = medicalService;
