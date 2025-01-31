import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import MyAxios from '../../utils/interceptor';
import Cookies from 'js-cookie';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await MyAxios.post('user/login', credentials);
      const { token, user } = response.data;

      Cookies.set('authToken', token, { secure: true, sameSite: 'Strict' });

      console.log('Utilisateur connecté:', user);

      return { user, token };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Erreur inconnue');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      console.log('Données d\'inscription envoyées:', userData);
      const response = await MyAxios.post('user/register', userData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        console.log('Erreur d\'inscription:', error.response.data.response);
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: 'Erreur inconnue' });
    }
  }
);

export const profileUser = createAsyncThunk(
  'auth/profileUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await MyAxios.get('user/profile');

      console.log('Profil utilisateur récupéré:', response.data);
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Erreur inconnue');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: Cookies.get('authToken') || null,
    isLoading: false,
    error: null,
    registerSuccess: false,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      Cookies.remove('authToken');
    },
    clearRegisterSuccess: (state) => {
      state.registerSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(profileUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(profileUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(profileUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
  },
});

export const { logout, clearRegisterSuccess } = authSlice.actions;
export default authSlice.reducer;