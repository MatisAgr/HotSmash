import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import MyAxios from '../../utils/interceptor';

export const getRandomMatches = createAsyncThunk(
  'matchs/getRandomMatches',
  async (_, { rejectWithValue }) => {
    try {
      const response = await MyAxios.get('/match/allRandom');
      return response.data;
    } catch (error) {
      return rejectWithValue({ message: error.response?.data?.error || 'Erreur inconnue' });
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
      return rejectWithValue({ message: error.response?.data?.error || 'Erreur inconnue', status: error.response?.status });
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
    actionCount: 0,
  },
  reducers: {
    resetMatch: (state) => {
      state.items = [];
      state.currentPage = 0;
      state.actionCount = 0;
    },
    nextPage: (state) => {
      state.currentPage += 1;
    },
    previousPage: (state) => {
      state.currentPage -= 1;
    },
    incrementActionCount: (state) => {
      state.actionCount += 1;
      if (state.actionCount >= 5) {
        state.actionCount = 0;
        state.items = [];
      }
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

export const { resetMatch, nextPage, previousPage, incrementActionCount } = matchsSlice.actions;
export default matchsSlice.reducer;