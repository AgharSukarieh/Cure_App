import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// الإعدادات الأساسية
const API_BASE_URL = 'http://10.42.0.1:8003/api';
const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  CITIES: 'cities_data',
  AREAS: 'areas_data',
  BLOCK_ID: 'block_id',
};

// ===== 1. إعداد Axios Instance =====
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor لإضافة التوكن تلقائياً
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ===== 2. دالة جلب البيانات من API =====
export const fetchCitiesAndAreas = async (token = null) => {
  try {
    console.log('🔄 جاري جلب المدن والمناطق...');
    console.log('🔑 Token:', token ? 'موجود' : 'غير موجود');
    
    // إذا تم تمرير التوكن، استخدمه مباشرة
    if (token) {
      const response = await axios.get(`${API_BASE_URL}/user/cities-areas`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 10000,
      });
      
      if (response.data.success) {
        const { cities, areas, block_id } = response.data.data;
        
        // طباعة البيانات في الكونسول
        console.log('🏙️ ========== البيانات المستقبلة من API ==========');
        console.log('🆔 Block ID:', block_id);
        console.log('🏙️ عدد المدن:', cities?.length || 0);
        console.log('📍 عدد المناطق:', areas?.length || 0);
        
        // طباعة المدن
        if (cities && cities.length > 0) {
          console.log('🏙️ المدن:');
          cities.forEach((city, index) => {
            console.log(`  ${index + 1}. ${city.name} (ID: ${city.id})`);
          });
        }
        
        // طباعة المناطق
        if (areas && areas.length > 0) {
          console.log('📍 المناطق:');
          areas.forEach((area, index) => {
            console.log(`  ${index + 1}. ${area.name} (ID: ${area.id}) - مدينة: ${area.city_name || 'غير محدد'} (City ID: ${area.city_id})`);
          });
        }
        
        console.log('🏙️ ============================================');
        
        // تخزين البيانات في AsyncStorage
        await AsyncStorage.multiSet([
          [STORAGE_KEYS.CITIES, JSON.stringify(cities)],
          [STORAGE_KEYS.AREAS, JSON.stringify(areas)],
          [STORAGE_KEYS.BLOCK_ID, block_id.toString()],
        ]);
        
        console.log('✅ تم جلب وتخزين البيانات بنجاح');
        
        return {
          success: true,
          data: {
            cities,
            areas,
            block_id,
          },
        };
      } else {
        throw new Error('فشل في جلب البيانات');
      }
    }
    
    // إذا لم يتم تمرير التوكن، استخدم الطريقة القديمة
    const response = await apiClient.get('/user/cities-areas');
    
    if (response.data.success) {
      const { cities, areas, block_id } = response.data.data;
      
      // طباعة البيانات في الكونسول
      console.log('🏙️ ========== البيانات المستقبلة من API ==========');
      console.log('🆔 Block ID:', block_id);
      console.log('🏙️ عدد المدن:', cities?.length || 0);
      console.log('📍 عدد المناطق:', areas?.length || 0);
      
      // طباعة المدن
      if (cities && cities.length > 0) {
        console.log('🏙️ المدن:');
        cities.forEach((city, index) => {
          console.log(`  ${index + 1}. ${city.name} (ID: ${city.id})`);
        });
      }
      
      // طباعة المناطق
      if (areas && areas.length > 0) {
        console.log('📍 المناطق:');
        areas.forEach((area, index) => {
          console.log(`  ${index + 1}. ${area.name} (ID: ${area.id}) - مدينة: ${area.city_name || 'غير محدد'} (City ID: ${area.city_id})`);
        });
      }
      
      console.log('🏙️ ============================================');
      
      // تخزين البيانات في AsyncStorage
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.CITIES, JSON.stringify(cities)],
        [STORAGE_KEYS.AREAS, JSON.stringify(areas)],
        [STORAGE_KEYS.BLOCK_ID, block_id.toString()],
      ]);
      
      console.log('✅ تم جلب وتخزين البيانات بنجاح');
      
      return {
        success: true,
        data: {
          cities,
          areas,
          block_id,
        },
      };
    } else {
      throw new Error('فشل في جلب البيانات');
    }
  } catch (error) {
    // صمتاً: لا نطبع أخطاء getcity/areas في الكونسول
    
    // محاولة جلب البيانات المخزنة محلياً
    const cachedData = await getCachedCitiesAndAreas();
    if (cachedData) {
      console.log('📦 استخدام البيانات المخزنة مسبقاً');
      return {
        success: true,
        data: cachedData,
        fromCache: true,
      };
    }
    
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'حدث خطأ غير متوقع',
    };
  }
};

// ===== 3. دالة جلب البيانات المخزنة محلياً =====
export const getCachedCitiesAndAreas = async () => {
  try {
    const [citiesStr, areasStr, blockIdStr] = await AsyncStorage.multiGet([
      STORAGE_KEYS.CITIES,
      STORAGE_KEYS.AREAS,
      STORAGE_KEYS.BLOCK_ID,
    ]);
    
    const cities = citiesStr[1] ? JSON.parse(citiesStr[1]) : null;
    const areas = areasStr[1] ? JSON.parse(areasStr[1]) : null;
    const block_id = blockIdStr[1] ? parseInt(blockIdStr[1]) : null;
    
    if (cities && areas && block_id) {
      return { cities, areas, block_id };
    }
    
    return null;
  } catch (error) {
    console.error('❌ خطأ في قراءة البيانات المخزنة:', error);
    return null;
  }
};

// ===== 4. دالة الحصول على مدينة معينة =====
export const getCityById = async (cityId) => {
  const data = await getCachedCitiesAndAreas();
  if (!data) return null;
  
  return data.cities.find(city => city.id === cityId);
};

// ===== 5. دالة الحصول على المناطق حسب المدينة =====
export const getAreasByCity = async (cityId) => {
  const data = await getCachedCitiesAndAreas();
  if (!data) return [];
  
  return data.areas.filter(area => area.city_id === cityId.toString());
};

// ===== 6. دالة الحصول على جميع المدن =====
export const getAllCities = async () => {
  const data = await getCachedCitiesAndAreas();
  return data?.cities || [];
};

// ===== 7. دالة الحصول على جميع المناطق =====
export const getAllAreas = async () => {
  const data = await getCachedCitiesAndAreas();
  return data?.areas || [];
};

// ===== 8. دالة حفظ التوكن =====
export const saveAuthToken = async (token) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
    console.log('✅ تم حفظ التوكن بنجاح');
    return true;
  } catch (error) {
    console.error('❌ خطأ في حفظ التوكن:', error);
    return false;
  }
};

// ===== 9. دالة حذف البيانات المخزنة =====
export const clearCachedData = async () => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.CITIES,
      STORAGE_KEYS.AREAS,
      STORAGE_KEYS.BLOCK_ID,
    ]);
    console.log('✅ تم حذف البيانات المخزنة');
    return true;
  } catch (error) {
    console.error('❌ خطأ في حذف البيانات:', error);
    return false;
  }
};

// ===== 10. دالة تحديث البيانات =====
export const refreshCitiesAndAreas = async () => {
  await clearCachedData();
  return await fetchCitiesAndAreas();
};

// ===== 11. دالة طباعة البيانات المخزنة في الكونسول =====
export const printCachedData = async () => {
  try {
    const cachedData = await getCachedCitiesAndAreas();
    
    if (cachedData) {
      console.log('📦 ========== البيانات المخزنة محلياً ==========');
      console.log('🆔 Block ID:', cachedData.block_id);
      console.log('🏙️ عدد المدن:', cachedData.cities?.length || 0);
      console.log('📍 عدد المناطق:', cachedData.areas?.length || 0);
      
      // طباعة المدن
      if (cachedData.cities && cachedData.cities.length > 0) {
        console.log('🏙️ المدن المخزنة:');
        cachedData.cities.forEach((city, index) => {
          console.log(`  ${index + 1}. ${city.name} (ID: ${city.id})`);
        });
      }
      
      // طباعة المناطق
      if (cachedData.areas && cachedData.areas.length > 0) {
        console.log('📍 المناطق المخزنة:');
        cachedData.areas.forEach((area, index) => {
          console.log(`  ${index + 1}. ${area.name} (ID: ${area.id}) - مدينة: ${area.city_name || 'غير محدد'} (City ID: ${area.city_id})`);
        });
      }
      
      console.log('📦 ============================================');
    } else {
      console.log('❌ لا توجد بيانات مخزنة محلياً');
    }
  } catch (error) {
    console.error('❌ خطأ في طباعة البيانات المخزنة:', error);
  }
};

export default {
  fetchCitiesAndAreas,
  getCachedCitiesAndAreas,
  getCityById,
  getAreasByCity,
  getAllCities,
  getAllAreas,
  saveAuthToken,
  clearCachedData,
  refreshCitiesAndAreas,
  printCachedData,
};
