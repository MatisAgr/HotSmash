import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import MyAxios from '../../utils/interceptor';

export const getAllPosts = createAsyncThunk(
  'matchs/getAllMatchs',
  async ({ limit }, { rejectWithValue }) => {
    try {
      const url = `/match/?limit=${limit}`;
      console.log('Dispatch getAllPosts avec limit:', limit);
      const response = await MyAxios.get(url);
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
    page: 1,
    hasMore: true,
    isLoading: false,
    error: null,
  },
  reducers: {
    resetMatch: (state) => {
      state.items = [];
      state.page = 1;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = [...state.items, ...action.payload.articles];
        state.page += 1;
        state.hasMore = action.payload.hasMore;
      })
      .addCase(getAllPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetArticles } = matchsSlice.actions;
export default matchsSlice.reducer;