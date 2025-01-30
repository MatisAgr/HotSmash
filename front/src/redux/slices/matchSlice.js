import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import MyAxios from '../../utils/interceptor';

export const getRandomMatches = createAsyncThunk(
  'matchs/getRandomMatches',
  async (_, { rejectWithValue }) => {
    try {
      const response = await MyAxios.get('/match/allRandom');
      return response.data;
    } catch (error) {
      return rejectWithValue({ message: error.response?.data?.message || 'Erreur inconnue' });
    }
  }
);

export const createMatch = createAsyncThunk(
  'matchs/createMatch',
  async (matchData, { rejectWithValue }) => {
    try {
      const response = await MyAxios.post('/match', matchData);
      return response.data;
    } catch (error) {
      return rejectWithValue({ message: error.response?.data?.message || 'Erreur inconnue' });
    }
  }
);

const matchsSlice = createSlice({
  name: 'match',
  initialState: {
    items: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    resetMatch: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRandomMatches.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getRandomMatches.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = [...state.items, ...action.payload];
      })
      .addCase(getRandomMatches.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createMatch.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createMatch.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items.push(action.payload);
      })
      .addCase(createMatch.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetMatch } = matchsSlice.actions;
export default matchsSlice.reducer;