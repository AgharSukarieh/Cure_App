// Custom Hook for Pharmacies
import { useState, useEffect, useCallback } from 'react';
import pharmacyService from '../services/pharmacyService';

/**
 * Custom hook for pharmacy management
 * @param {Object} options - Hook options
 * @returns {Object} Pharmacy state and methods
 */
export const usePharmacies = (options = {}) => {
  const [pharmacies, setPharmacies] = useState([]);
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
      fetchPharmacies(initialParams);
    }
  }, [autoFetch]);

  /**
   * Fetch pharmacies list
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Fetch result
   */
  const fetchPharmacies = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await pharmacyService.getPharmacies(params);
      
      if (result.success) {
        setPharmacies(result.data);
        setPagination(result.pagination);
      } else {
        setError(result.message);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'خطأ في جلب قائمة الصيدليات';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch user's pharmacies
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Fetch result
   */
  const fetchUserPharmacies = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await pharmacyService.getUserPharmacies(params);
      
      if (result.success) {
        setPharmacies(result.data);
        setPagination(result.pagination);
      } else {
        setError(result.message);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'خطأ في جلب صيدلياتك';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create new pharmacy
   * @param {Object} pharmacyData - Pharmacy data
   * @returns {Promise<Object>} Create result
   */
  const createPharmacy = useCallback(async (pharmacyData) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await pharmacyService.createPharmacy(pharmacyData);
      
      if (result.success) {
        // Refresh the list
        await fetchUserPharmacies();
      } else {
        setError(result.message);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'خطأ في إنشاء الصيدلية';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [fetchUserPharmacies]);

  /**
   * Update pharmacy
   * @param {number} pharmacyId - Pharmacy ID
   * @param {Object} pharmacyData - Updated pharmacy data
   * @returns {Promise<Object>} Update result
   */
  const updatePharmacy = useCallback(async (pharmacyId, pharmacyData) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await pharmacyService.updatePharmacy(pharmacyId, pharmacyData);
      
      if (result.success) {
        // Update the pharmacy in the list
        setPharmacies(prev => prev.map(pharmacy => 
          pharmacy.id === pharmacyId ? { ...pharmacy, ...result.data } : pharmacy
        ));
      } else {
        setError(result.message);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'خطأ في تحديث الصيدلية';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Delete pharmacy
   * @param {number} pharmacyId - Pharmacy ID
   * @returns {Promise<Object>} Delete result
   */
  const deletePharmacy = useCallback(async (pharmacyId) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await pharmacyService.deletePharmacy(pharmacyId);
      
      if (result.success) {
        // Remove the pharmacy from the list
        setPharmacies(prev => prev.filter(pharmacy => pharmacy.id !== pharmacyId));
      } else {
        setError(result.message);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'خطأ في حذف الصيدلية';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get pharmacy by ID
   * @param {number} pharmacyId - Pharmacy ID
   * @returns {Promise<Object>} Pharmacy details result
   */
  const getPharmacyById = useCallback(async (pharmacyId) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await pharmacyService.getPharmacyById(pharmacyId);
      
      return result;
    } catch (error) {
      const errorMessage = 'خطأ في جلب بيانات الصيدلية';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Search pharmacies
   * @param {Object} searchParams - Search parameters
   * @returns {Promise<Object>} Search result
   */
  const searchPharmacies = useCallback(async (searchParams) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await pharmacyService.searchPharmacies(searchParams);
      
      if (result.success) {
        setPharmacies(result.data);
        setPagination(result.pagination);
      } else {
        setError(result.message);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'خطأ في البحث عن الصيدليات';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get nearby pharmacies
   * @param {number} latitude - Latitude
   * @param {number} longitude - Longitude
   * @param {number} radius - Search radius
   * @returns {Promise<Object>} Nearby pharmacies result
   */
  const getNearbyPharmacies = useCallback(async (latitude, longitude, radius = 10) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await pharmacyService.getNearbyPharmacies(latitude, longitude, radius);
      
      if (result.success) {
        setPharmacies(result.data);
      } else {
        setError(result.message);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'خطأ في جلب الصيدليات القريبة';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get pharmacy cities
   * @returns {Promise<Object>} Cities result
   */
  const getPharmacyCities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await pharmacyService.getPharmacyCities();
      
      return result;
    } catch (error) {
      const errorMessage = 'خطأ في جلب مدن الصيدليات';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get pharmacy areas by city
   * @param {number} cityId - City ID
   * @returns {Promise<Object>} Areas result
   */
  const getPharmacyAreas = useCallback(async (cityId) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await pharmacyService.getPharmacyAreas(cityId);
      
      return result;
    } catch (error) {
      const errorMessage = 'خطأ في جلب مناطق الصيدليات';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Add pharmacy image
   * @param {FormData} imageData - Image data
   * @returns {Promise<Object>} Add image result
   */
  const addPharmacyImage = useCallback(async (imageData) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await pharmacyService.addPharmacyImage(imageData);
      
      return result;
    } catch (error) {
      const errorMessage = 'خطأ في رفع صورة الصيدلية';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Refresh pharmacies list
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Refresh result
   */
  const refresh = useCallback(async (params = {}) => {
    try {
      setRefreshing(true);
      setError(null);
      
      const result = await pharmacyService.getUserPharmacies(params);
      
      if (result.success) {
        setPharmacies(result.data);
        setPagination(result.pagination);
      } else {
        setError(result.message);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'خطأ في تحديث قائمة الصيدليات';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setRefreshing(false);
    }
  }, []);

  /**
   * Load more pharmacies (pagination)
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Load more result
   */
  const loadMore = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await pharmacyService.getUserPharmacies(params);
      
      if (result.success) {
        setPharmacies(prev => [...prev, ...result.data]);
        setPagination(result.pagination);
      } else {
        setError(result.message);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'خطأ في تحميل المزيد من الصيدليات';
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
    pharmacies,
    loading,
    error,
    pagination,
    refreshing,
    
    // Methods
    fetchPharmacies,
    fetchUserPharmacies,
    createPharmacy,
    updatePharmacy,
    deletePharmacy,
    getPharmacyById,
    searchPharmacies,
    getNearbyPharmacies,
    getPharmacyCities,
    getPharmacyAreas,
    addPharmacyImage,
    refresh,
    loadMore,
    clearError
  };
};
