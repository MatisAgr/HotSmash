// Import necessary functions and reducers
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import postSlice from './slices/postSlice';
import onlineUsersReducer from './slices/onlineUsersSlice';

// Configure the Redux store with the root reducer
const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postSlice,
    onlineUsers: onlineUsersReducer
  }
});

export default store;
