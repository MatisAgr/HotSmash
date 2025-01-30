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

export const passMatch = createAsyncThunk(
  'matchs/passMatch',
  async ({ userId, matchId }, { rejectWithValue }) => {
    try {
      const response = await MyAxios.post('/match/pass', { userId, matchId });
      return { matchId };
    } catch (error) {
      return rejectWithValue({ message: error.response?.data?.message || 'Erreur inconnue' });
    }
  }
);

export const smashMatch = createAsyncThunk(
  'matchs/smashMatch',
  async ({ userId, matchId }, { rejectWithValue }) => {
    try {
      const response = await MyAxios.post('/match/smash', { userId, matchId });
      return { matchId };
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
    currentPage: 0,
  },
  reducers: {
    resetMatch: (state) => {
      state.items = [];
      state.currentPage = 0;
    },
    nextPage: (state) => {
      state.currentPage += 1;
    },
    previousPage: (state) => {
      state.currentPage -= 1;
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
        state.items = action.payload;
      })
      .addCase(getRandomMatches.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(passMatch.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item._id !== action.payload.matchId);
      })
      .addCase(smashMatch.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item._id !== action.payload.matchId);
      });
  },
});

export const { resetMatch, nextPage, previousPage } = matchsSlice.actions;
export default matchsSlice.reducer;