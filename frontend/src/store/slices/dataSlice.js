import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { earthquakeService } from '../../services/earthquakeService';
import { statsService } from '../../services/statsService';

export const fetchEarthquakes = createAsyncThunk('data/fetchEarthquakes', async (limit = 100, { rejectWithValue }) => {
  try {
    const res = await earthquakeService.getRecentEarthquakes(limit);
    return res.data || res;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to fetch earthquakes');
  }
});

export const fetchStats = createAsyncThunk('data/fetchStats', async (_, { rejectWithValue }) => {
  try {
    const res = await statsService.getOverview();
    return res.data || res;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to fetch stats');
  }
});

const initialState = {
  earthquakes: [],
  stats: null,
  loading: false,
  error: null,
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    addEarthquake: (state, action) => {
      state.earthquakes.unshift(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEarthquakes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEarthquakes.fulfilled, (state, action) => {
        state.loading = false;
        state.earthquakes = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchEarthquakes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addEarthquake } = dataSlice.actions;
export default dataSlice.reducer;
