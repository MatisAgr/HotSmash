// filepath: /c:/Users/matis/Desktop/Ceci est un dossier SSD/IPSSI/BigData-IA/S5_REACT_NATIVE/TP_Groupe/front/src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import MyAxios from '../../utils/interceptor';
import Cookies from 'js-cookie';

// Requête pour login avec stockage du token dans un cookie
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await MyAxios.post('/auth/login', credentials);
      const { token, user } = response.data;

      // Stocker le token dans un cookie sécurisé
      Cookies.set('authToken', token, { secure: true, sameSite: 'Strict' });

      return { user, token };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Erreur inconnue');
    }
  }
);

// Requête pour l'inscription avec gestion des erreurs
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      console.log('Données d\'inscription envoyées:', userData); // Log des données
      const response = await MyAxios.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      // Vérifier si le backend renvoie des erreurs de validation
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
      const response = await MyAxios.get('/auth/profile');
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
    registerSuccess: false, // Ajout d'un état pour l'inscription
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
      // Gestion de loginUser
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
      // Gestion de registerUser
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.registerSuccess = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.registerSuccess = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Gestion de profileUser
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
      });
  },
});

export const { logout, clearRegisterSuccess } = authSlice.actions;
export default authSlice.reducer;