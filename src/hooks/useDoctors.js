// Custom Hook for Doctors
import { useState, useEffect, useCallback } from 'react';
import doctorService from '../services/doctorService';

/**
 * Custom hook for doctor management
 * @param {Object} options - Hook options
 * @returns {Object} Doctor state and methods
 */
export const useDoctors = (options = {}) => {
  const [doctors, setDoctors] = useState([]);
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
      fetchDoctors(initialParams);
    }
  }, [autoFetch]);

  /**
   * Fetch doctors list
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Fetch result
   */
  const fetchDoctors = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await doctorService.getDoctors(params);
      
      if (result.success) {
        setDoctors(result.data);
        setPagination(result.pagination);
      } else {
        setError(result.message);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'خطأ في جلب قائمة الأطباء';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch user's doctors
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Fetch result
   */
  const fetchUserDoctors = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await doctorService.getUserDoctors(params);
      
      if (result.success) {
        setDoctors(result.data);
        setPagination(result.pagination);
      } else {
        setError(result.message);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'خطأ في جلب أطبائك';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create new doctor
   * @param {Object} doctorData - Doctor data
   * @returns {Promise<Object>} Create result
   */
  const createDoctor = useCallback(async (doctorData) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await doctorService.createDoctor(doctorData);
      
      if (result.success) {
        // Refresh the list
        await fetchUserDoctors();
      } else {
        setError(result.message);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'خطأ في إنشاء الطبيب';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [fetchUserDoctors]);

  /**
   * Update doctor
   * @param {number} doctorId - Doctor ID
   * @param {Object} doctorData - Updated doctor data
   * @returns {Promise<Object>} Update result
   */
  const updateDoctor = useCallback(async (doctorId, doctorData) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await doctorService.updateDoctor(doctorId, doctorData);
      
      if (result.success) {
        // Update the doctor in the list
        setDoctors(prev => prev.map(doctor => 
          doctor.id === doctorId ? { ...doctor, ...result.data } : doctor
        ));
      } else {
        setError(result.message);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'خطأ في تحديث الطبيب';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Delete doctor
   * @param {number} doctorId - Doctor ID
   * @returns {Promise<Object>} Delete result
   */
  const deleteDoctor = useCallback(async (doctorId) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await doctorService.deleteDoctor(doctorId);
      
      if (result.success) {
        // Remove the doctor from the list
        setDoctors(prev => prev.filter(doctor => doctor.id !== doctorId));
      } else {
        setError(result.message);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'خطأ في حذف الطبيب';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get doctor by ID
   * @param {number} doctorId - Doctor ID
   * @returns {Promise<Object>} Doctor details result
   */
  const getDoctorById = useCallback(async (doctorId) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await doctorService.getDoctorById(doctorId);
      
      return result;
    } catch (error) {
      const errorMessage = 'خطأ في جلب بيانات الطبيب';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Search doctors
   * @param {Object} searchParams - Search parameters
   * @returns {Promise<Object>} Search result
   */
  const searchDoctors = useCallback(async (searchParams) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await doctorService.searchDoctors(searchParams);
      
      if (result.success) {
        setDoctors(result.data);
        setPagination(result.pagination);
      } else {
        setError(result.message);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'خطأ في البحث عن الأطباء';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get doctor specialties
   * @returns {Promise<Object>} Specialties result
   */
  const getSpecialties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await doctorService.getSpecialties();
      
      return result;
    } catch (error) {
      const errorMessage = 'خطأ في جلب التخصصات';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get doctor cities
   * @returns {Promise<Object>} Cities result
   */
  const getDoctorCities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await doctorService.getDoctorCities();
      
      return result;
    } catch (error) {
      const errorMessage = 'خطأ في جلب مدن الأطباء';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get doctor areas by city
   * @param {number} cityId - City ID
   * @returns {Promise<Object>} Areas result
   */
  const getDoctorAreas = useCallback(async (cityId) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await doctorService.getDoctorAreas(cityId);
      
      return result;
    } catch (error) {
      const errorMessage = 'خطأ في جلب مناطق الأطباء';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Refresh doctors list
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Refresh result
   */
  const refresh = useCallback(async (params = {}) => {
    try {
      setRefreshing(true);
      setError(null);
      
      const result = await doctorService.getUserDoctors(params);
      
      if (result.success) {
        setDoctors(result.data);
        setPagination(result.pagination);
      } else {
        setError(result.message);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'خطأ في تحديث قائمة الأطباء';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setRefreshing(false);
    }
  }, []);

  /**
   * Load more doctors (pagination)
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Load more result
   */
  const loadMore = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await doctorService.getUserDoctors(params);
      
      if (result.success) {
        setDoctors(prev => [...prev, ...result.data]);
        setPagination(result.pagination);
      } else {
        setError(result.message);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'خطأ في تحميل المزيد من الأطباء';
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
    doctors,
    loading,
    error,
    pagination,
    refreshing,
    
    // Methods
    fetchDoctors,
    fetchUserDoctors,
    createDoctor,
    updateDoctor,
    deleteDoctor,
    getDoctorById,
    searchDoctors,
    getSpecialties,
    getDoctorCities,
    getDoctorAreas,
    refresh,
    loadMore,
    clearError
  };
};
