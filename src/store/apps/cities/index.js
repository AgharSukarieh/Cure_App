import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {get, post, put, del, getPage } from '../../../WebService/RequestBuilder';
import { BASE_URL } from '../../../config/apiConfig';

export const fetchData = createAsyncThunk('appCities/fetchData', async () => {
  const response = await get('/data');
  return response;
});

// جلب المدن والمناطق الخاصة بالمستخدم (يعتمد على المستخدم المصادق)
export const fetchCitiesAndAreas = createAsyncThunk(
  'appCities/fetchCitiesAndAreas',
  async ({ token }, { rejectWithValue }) => {
    try {
      if (!token) {
        throw new Error('Missing token');
      }

      console.log('🌐 Redux Store: بدء جلب المدن والمناطق...');
      console.log('🔑 Token:', token ? 'موجود' : 'غير موجود');
      console.log('🔑 Token Value:', token);
      
      // استخدام RequestBuilder الذي يضيف Authorization تلقائياً من AsyncStorage/RequestBuilder
      const response = await get('user/cities-areas');

      console.log('📥 Response Data:', response);
      
      // RequestBuilder يعيد response.data مباشرة. بعض الـ endpoints تعود مباشرة بدون success
      const data = response?.data ?? response;

      // دعم شكلين: { success: true, data: {...} } أو { cities: [...], areas: [...], block_id }
      const payload = (data && data.data) ? data.data : data;

      if (payload && (Array.isArray(payload.cities) || Array.isArray(payload.areas))) {
        console.log('✅ تم جلب البيانات بنجاح من API');
        console.log('🆔 Block ID:', payload.block_id);
        console.log('🏙️ عدد المدن:', payload.cities?.length || 0);
        console.log('📍 عدد المناطق:', payload.areas?.length || 0);
        return payload; // يحتوي على block_id, cities, areas
      }

      const message = data?.message || 'Failed to fetch user cities/areas';
      console.log('❌ فشل في جلب البيانات:', message);
      return rejectWithValue(message);
    } catch (error) {
      console.error('❌ خطأ في جلب البيانات:', error.message);
      return rejectWithValue(error.message || 'Unknown error');
    }
  }
);

// Fetch data with pagination
export const fetchPaginationData = createAsyncThunk('appCities/fetchPaginationData', async (page) => {
  const response = await getPage('/data', page);
  return response;
});

// Create data
export const createData = createAsyncThunk('api/createData', async (data) => {
  const response = await post('/data', data);
  return response;
});

// Update data
export const updateData = createAsyncThunk('api/updateData', async ({ id, data }) => {
  const response = await put(`/data/${id}`, data);
  return response;
});

// Delete data
export const deleteData = createAsyncThunk('api/deleteData', async (id) => {
  const response = await del(`/data/${id}`);
  return response;
});

export const appCitySlice = createSlice({
  name: 'appCities',
  initialState: {
    data: [],
    pagination: {
      current_page: 1,
      items_per_page: 10,
      total_items: 1,
      total_pages: 1,
    },
    params: {},
    loading: false,
    error: null,
    // بيانات المدن والمناطق الخاصة بالمستخدم
    userLocationData: {
      block_id: null,
      cities: [],
      areas: [],
      citiesFormatted: [], // للفلترة
      areasFormatted: [], // للفلترة
      // خرائط تسريع الوصول حسب المعرف
      citiesMap: {},
      areasMap: {},
      loading: false,
      error: null,
      lastUpdated: null,
    },
  },
  reducers: {
    // مسح بيانات المدن والمناطق
    clearUserLocationData: (state) => {
      state.userLocationData = {
        block_id: null,
        cities: [],
        areas: [],
        citiesFormatted: [],
        areasFormatted: [],
        citiesMap: {},
        areasMap: {},
        loading: false,
        error: null,
        lastUpdated: null,
      };
    },
    // تحديث المناطق عند اختيار مدينة
    updateAreasForCity: (state, action) => {
      const cityId = action.payload;
      const cityAreas = state.userLocationData.areas.filter(area => area.city_id === cityId);
      state.userLocationData.areasFormatted = cityAreas.map(area => ({
        value: area.id,
        label: area.name,
      }));
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchData.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.status) {
          state.data = action.payload.data;
          state.pagination = action.payload.pagination;
        } else {
          state.data = [];
        }
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      /////////////////////////////////////////////////
      .addCase(fetchPaginationData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaginationData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchPaginationData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createData.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateData.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteData.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      /////////////////////////////////////////////////
      // جلب المدن والمناطق الخاصة بالمستخدم
      .addCase(fetchCitiesAndAreas.pending, (state) => {
        console.log('⏳ Redux: fetchCitiesAndAreas.pending');
        state.userLocationData.loading = true;
        state.userLocationData.error = null;
      })
      .addCase(fetchCitiesAndAreas.fulfilled, (state, action) => {
        console.log('✅ Redux: fetchCitiesAndAreas.fulfilled');
        console.log('📦 Payload:', action.payload);
        
        state.userLocationData.loading = false;
        state.userLocationData.block_id = action.payload.block_id || null;
        state.userLocationData.cities = Array.isArray(action.payload.cities) ? action.payload.cities : [];
        state.userLocationData.areas = Array.isArray(action.payload.areas) ? action.payload.areas : [];
        
        // تحضير البيانات للفلترة
        state.userLocationData.citiesFormatted = state.userLocationData.cities.map(city => ({
          value: city.id,
          label: city.name,
        }));
        
        // إنشاء خرائط للوصول السريع حسب المعرّف
        const citiesMap = {};
        for (const city of state.userLocationData.cities) {
          if (city && city.id != null) {
            citiesMap[city.id] = city;
          }
        }
        // إنشاء خريطة للمناطق
        const areasMap = {};
        for (const area of state.userLocationData.areas) {
          if (area && area.id != null) {
            areasMap[area.id] = area;
          }
        }
        state.userLocationData.citiesMap = citiesMap;
        state.userLocationData.areasMap = areasMap;
        // إبقاء تنسيق المناطق كما هو (سيتم تحديثه عند اختيار مدينة)
        
        state.userLocationData.lastUpdated = new Date().toISOString();
        
        console.log('💾 Redux: تم حفظ البيانات في Store');
        console.log('🏙️ المدن المحفوظة:', state.userLocationData.cities.length);
        console.log('📍 المناطق المحفوظة:', state.userLocationData.areas.length);
      })
      .addCase(fetchCitiesAndAreas.rejected, (state, action) => {
        console.log('❌ Redux: fetchCitiesAndAreas.rejected');
        console.log('❌ Error:', action.payload);
        state.userLocationData.loading = false;
        state.userLocationData.error = action.payload || 'Failed to fetch user cities/areas';
      });
  },
});

export const { clearUserLocationData, updateAreasForCity } = appCitySlice.actions;
export default appCitySlice.reducer;