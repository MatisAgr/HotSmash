import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import MyAxios from '../../utils/interceptor';

// Thunk pour récupérer tous les posts
export const getAllPosts = createAsyncThunk(
  'posts/getAllPosts',
  async ({ limit }, { rejectWithValue }) => {
    try {
      const url = `/forum/?limit=${limit}`;
      console.log('Dispatch getAllPosts avec limit:', limit);
      const response = await MyAxios.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue({ message: error.response?.data?.message || 'Erreur inconnue' });
    }
  }
);

// Thunk pour récupérer les posts avant un timestamp donné
export const getPostsBefore = createAsyncThunk(
  'posts/getPostsBefore',
  async ({ timestamp, limit }, { rejectWithValue }) => {
    try {
      console.log(`Fetching posts before ${timestamp} with limit ${limit}`);
      const url = `/forum/before/${timestamp}?limit=${limit}`;
      const response = await MyAxios.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue({ message: error.response?.data?.message || 'Erreur inconnue' });
    }
  }
);

// Thunk pour créer un post
export const createPost = createAsyncThunk(
  'posts/createPost',
  async ({ title, content, author }, { rejectWithValue }) => {
    try {
      const response = await MyAxios.post('/forum', { title, content, author });
      return response.data;
    } catch (error) {
      return rejectWithValue({ message: error.response?.data?.message || 'Erreur inconnue' });
    }
  }
);

// Thunk pour récupérer un post par ID
export const getPostById = createAsyncThunk(
  'posts/getPostById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await MyAxios.get(`/forum/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue({ message: error.response?.data?.message || 'Erreur inconnue' });
    }
  }
);

// Thunk pour supprimer un post par ID
export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (id, { rejectWithValue }) => {
    try {
      await MyAxios.delete(`/forum/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue({ message: error.response?.data?.message || 'Erreur inconnue' });
    }
  }
);

const postSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    isLoading: false,
    lastTimestamp: null,
    error: null,
    hasMore: true
  },
  reducers: {},
  extraReducers: (builder) => {

    // Créer un post
    builder
      .addCase(createPost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts.unshift(action.payload); // Ajoute le nouveau post au début
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Récupérer tous les posts avec pagination initiale
      .addCase(getAllPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.length < 5) { // Modifier condition pour hasMore
          state.hasMore = false;
        } else {
          state.posts = [...action.payload];
          state.lastTimestamp = action.payload[action.payload.length - 1].createdAt;
        }
      })
      .addCase(getAllPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Récupérer les posts avant un timestamp
      .addCase(getPostsBefore.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPostsBefore.fulfilled, (state, action) => {
        console.log(`Fetched ${action.payload.length} posts`);
        state.isLoading = false;
        if (action.payload.length < 5) { // Modifier condition pour hasMore
          state.hasMore = false;
        } else {
          const newPosts = action.payload.filter(
            newPost => !state.posts.some(existingPost => existingPost._id === newPost._id)
          );
          state.posts = [...state.posts, ...newPosts];
          if (newPosts.length > 0) {
            state.lastTimestamp = newPosts[newPosts.length - 1].createdAt;
          }
        }
      })
      .addCase(getPostsBefore.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Récupérer un post par ID
      .addCase(getPostById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPostById.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.posts.findIndex(post => post._id === action.payload._id);
        if (index === -1) {
          state.posts.push(action.payload);
        } else {
          state.posts[index] = action.payload;
        }
      })
      .addCase(getPostById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Supprimer un post par ID
      .addCase(deletePost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = state.posts.filter(post => post._id !== action.payload);
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default postSlice.reducer;