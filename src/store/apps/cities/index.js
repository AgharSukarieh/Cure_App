import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';

import {get, post, put, del, getPage } from '../../../WebService/RequestBuilder';

export const fetchData = createAsyncThunk('appCities/fetchData', async () => {
  const response = await get('/data');
  return response;
});

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

// export const addCity = createAsyncThunk(
//   'appCities/addCity',
//   async (params, {rejectWithValue}) => {
//     try {
//       const response = await RequestBuilder({
//         endPoint: '/cities',
//         method: 'post',
//         params: params,
//       });

//       return response;
//     } catch (err) {
//       return rejectWithValue(err.response.data);
//     }
//   },
// );

// export const updateCity = createAsyncThunk(
//   'appCities/updateCity',
//   async (params, {rejectWithValue}) => {
//     try {
//       const response = await RequestBuilder({
//         endPoint: '/cities',
//         method: 'put',
//         params: params,
//       });

//       return response;
//     } catch (err) {
//       return rejectWithValue(err);
//     }
//   },
// );

// export const deleteCity = createAsyncThunk(
//   'appCities/deleteCity',
//   async (params, {rejectWithValue}) => {
//     try {
//       const response = await RequestBuilder({
//         endPoint: '/cities',
//         method: 'delete',
//         params: params,
//       });

//       return {...response, data: {_id: params.id}};
//     } catch (err) {
//       return rejectWithValue(err);
//     }
//   },
// );

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
  },
  reducers: {},
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
      .addCase(createData.fulfilled, (state, action) => {
        state.loading = false;
        // Handle the created data if needed
      })
      .addCase(createData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateData.fulfilled, (state, action) => {
        state.loading = false;
        // Handle the updated data if needed
      })
      .addCase(updateData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteData.fulfilled, (state, action) => {
        state.loading = false;
        // Handle the deleted data if needed
      })
      .addCase(deleteData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
      /////////////////////////////////////////////////
  //     .addCase(addCity.fulfilled, (state, action) => {
  //       state.loading = false;
  //       if (action.payload.status) {
  //         state.data.insert(0, action.payload.data);
  //       }
  //     })
  //     .addCase(updateCity.fulfilled, (state, action) => {
  //       state.loading = false;
  //       if (action.payload.status) {
  //         let data = [...state.data];
  //         const index = data.findIndex(
  //           item => item._id === action.payload.data._id,
  //         );
  //         data[index] = action.payload.data;
  //         state.data = data;
  //       }
  //     })
  //     .addCase(updateCity.rejected, (state, action) => {
  //       state.loading = false;
  //     })
  //     .addCase(deleteCity.fulfilled, (state, action) => {
  //       state.loading = false;
  //       if (action.payload.status) {
  //         let data = [...state.data];
  //         state.data = data.filter(item => item._id != action.payload.data._id);
  //       }
  //     });
  },
});

// Array.prototype.insert = function (index, item) {
//   this.splice(index, 0, item);
// };

export default appCitySlice.reducer;
