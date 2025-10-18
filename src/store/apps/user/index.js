import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  userData: null,
  loading: false,
  error: null,
};

// ✅ Thunk لتخزين بيانات المستخدم
export const setUserData = createAsyncThunk(
  'user/setUserData',
  async (userData, { rejectWithValue }) => {
    try {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('💾 تخزين بيانات المستخدم في Redux');
      console.log('📋 User Data:', userData);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      return userData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Thunk لمسح بيانات المستخدم
export const clearUserData = createAsyncThunk(
  'user/clearUserData',
  async (_, { rejectWithValue }) => {
    try {
      console.log('🗑️ مسح بيانات المستخدم من Redux');
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // ✅ تحديث بيانات المستخدم مباشرة (بدون async)
    updateUser: (state, action) => {
      console.log('🔄 تحديث بيانات المستخدم:', action.payload);
      state.userData = {
        ...state.userData,
        ...action.payload
      };
    },
    // ✅ مسح بيانات المستخدم مباشرة
    resetUser: (state) => {
      console.log('🗑️ إعادة تعيين بيانات المستخدم');
      state.userData = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // ✅ setUserData
    builder
      .addCase(setUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
        state.error = null;
        console.log('✅ تم تخزين بيانات المستخدم في Redux بنجاح');
      })
      .addCase(setUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error('❌ فشل تخزين بيانات المستخدم:', action.payload);
      });
    
    // ✅ clearUserData
    builder
      .addCase(clearUserData.fulfilled, (state) => {
        state.userData = null;
        state.error = null;
        console.log('✅ تم مسح بيانات المستخدم من Redux');
      });
  }
});

// Export actions
export const { updateUser, resetUser } = userSlice.actions;

// Export reducer
export default userSlice.reducer;

