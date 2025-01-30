import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import MyAxios from '../../utils/interceptor';

export const fetchArticles = createAsyncThunk(
  'articles/fetchArticles',
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const response = await MyAxios.get(`/api/articles?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Erreur inconnue');
    }
  }
);

const articlesSlice = createSlice({
  name: 'articles',
  initialState: {
    items: [],
    page: 1,
    hasMore: true,
    isLoading: false,
    error: null,
  },
  reducers: {
    resetArticles: (state) => {
      state.items = [];
      state.page = 1;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = [...state.items, ...action.payload.articles];
        state.page += 1;
        state.hasMore = action.payload.hasMore;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetArticles } = articlesSlice.actions;
export default articlesSlice.reducer;