import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  fetchCitiesAndAreas as serviceFetchCitiesAndAreas,
  getCachedCitiesAndAreas
} from '../../../services/locationService'
import { apiClient } from '../../../config/apiConfig'

// Thunk to fetch cities and areas from API (or cache fallback)
export const fetchCitiesAndAreas = createAsyncThunk(
  'cities/fetchCitiesAndAreas',
  async (token, { rejectWithValue }) => {
    try {
      const result = await serviceFetchCitiesAndAreas(token)
      if (result.success) {
        return result.data
      }
      return rejectWithValue(result.error || 'Failed to fetch cities and areas')
    } catch (error) {
      // fallback to cache
      const cached = await getCachedCitiesAndAreas()
      if (cached) return cached
      return rejectWithValue(error.message || 'Unexpected error fetching cities and areas')
    }
  }
)

// Thunk to fetch public cities from /getcity
export const fetchCitiesPublic = createAsyncThunk(
  'cities/fetchCitiesPublic',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('getcity')
      const payload = response?.data
      if (payload && (payload.status === true || payload.success === true) && Array.isArray(payload.data)) {
        const cities = payload.data.map(item => ({ id: item.id, name: item.name }))
        return { cities }
      }
      return rejectWithValue(payload?.message || 'Failed to fetch cities')
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Unexpected error fetching cities')
    }
  }
)

// Thunk to fetch areas for a given city id from /getAreas/{city_id}
export const fetchAreasByCity = createAsyncThunk(
  'cities/fetchAreasByCity',
  async (cityId, { rejectWithValue }) => {
    try {
      if (cityId == null) return rejectWithValue('cityId is required')
      const response = await apiClient.get(`getAreas/${cityId}`)
      const payload = response?.data
      // Accept both raw array and wrapped {status,data}
      let list = []
      if (Array.isArray(payload)) {
        list = payload
      } else if (payload && (payload.status === true || payload.success === true) && Array.isArray(payload.data)) {
        list = payload.data
      }
      if (Array.isArray(list)) {
        const areas = list.map(item => ({ id: item.id, name: item.name, city_id: String(item.city_id ?? cityId) }))
        return { cityId, areas }
      }
      return rejectWithValue(payload?.message || 'Failed to fetch areas')
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Unexpected error fetching areas')
    }
  }
)

const initialState = {
  userLocationData: {
    block_id: null,
    cities: [],
    areas: [],
    citiesFormatted: [], // [{value,label,areas}]
    citiesMap: {}, // { [cityId]: city }
    areasMap: {} // { [areaId]: area }
  },
  loading: false,
  error: null,
  // derived UI helpers
  filteredAreasByCityId: []
}

const citiesSlice = createSlice({
  name: 'cities',
  initialState,
  reducers: {
    updateAreasForCity(state, action) {
      const cityId = action.payload
      const cityIdStr = cityId != null ? String(cityId) : ''
      state.filteredAreasByCityId = (state.userLocationData.areas || []).filter(
        a => String(a.city_id) === cityIdStr
      )
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCitiesAndAreas.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCitiesAndAreas.fulfilled, (state, action) => {
        const { cities = [], areas = [], block_id = null } = action.payload || {}

        const citiesMap = {}
        const areasMap = {}
        const citiesFormatted = cities.map(city => {
          citiesMap[city?.id] = city
          const areasForCity = areas.filter(a => String(a?.city_id) === String(city?.id))
          areasForCity.forEach(a => {
            areasMap[a?.id] = a
          })
          return {
            value: city?.id,
            label: city?.name,
            areas: areasForCity
          }
        })

        state.userLocationData = {
          block_id,
          cities,
          areas,
          citiesFormatted,
          citiesMap,
          areasMap
        }
        state.loading = false
        state.error = null
      })
      .addCase(fetchCitiesAndAreas.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to fetch cities and areas'
      })
      // Handle public cities fetch
      .addCase(fetchCitiesPublic.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCitiesPublic.fulfilled, (state, action) => {
        const { cities = [] } = action.payload || {}

        const citiesMap = {}
        const citiesFormatted = cities.map(city => {
          citiesMap[city?.id] = city
          return {
            value: city?.id,
            label: city?.name,
            areas: []
          }
        })

        state.userLocationData.cities = cities
        state.userLocationData.citiesFormatted = citiesFormatted
        state.userLocationData.citiesMap = citiesMap
        // keep existing areas/areasMap/block_id as-is
        state.loading = false
        state.error = null
      })
      .addCase(fetchCitiesPublic.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to fetch cities'
      })
      // Handle areas per city fetch and merge
      .addCase(fetchAreasByCity.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAreasByCity.fulfilled, (state, action) => {
        const { areas = [], cityId } = action.payload || {}
        // merge unique areas
        const existing = state.userLocationData.areas || []
        const mergedMap = {}
        existing.forEach(a => {
          if (a?.id != null) mergedMap[a.id] = a
        })
        areas.forEach(a => {
          if (a?.id != null) mergedMap[a.id] = a
        })
        const merged = Object.values(mergedMap)

        // rebuild areasMap
        const areasMap = {}
        merged.forEach(a => {
          areasMap[a?.id] = a
        })

        // update citiesFormatted to include areas for this city
        const citiesFormatted = (state.userLocationData.cities || []).map(city => {
          if (String(city?.id) === String(cityId)) {
            const cityAreas = merged.filter(a => String(a?.city_id) === String(city?.id))
            return { value: city?.id, label: city?.name, areas: cityAreas }
          }
          const otherAreas = merged.filter(a => String(a?.city_id) === String(city?.id))
          return { value: city?.id, label: city?.name, areas: otherAreas }
        })

        state.userLocationData.areas = merged
        state.userLocationData.areasMap = areasMap
        state.userLocationData.citiesFormatted = citiesFormatted
        state.loading = false
        state.error = null
      })
      .addCase(fetchAreasByCity.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to fetch areas'
      })
  }
})

export const { updateAreasForCity } = citiesSlice.actions
export default citiesSlice.reducer
export const selectUserLocationData = state => state.cities.userLocationData
export const selectCitiesLoading = state => state.cities.loading
export const selectCitiesError = state => state.cities.error
export const selectFilteredAreas = state => state.cities.filteredAreasByCityId

