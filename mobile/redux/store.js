// Import necessary functions and reducers
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import matchSlice from './slices/matchSlice';
import onlineUsersReducer from './slices/onlineUsersSlice';
import smashSlice from './slices/smashSlice';

// Configure the Redux store with the root reducer
const store = configureStore({
  reducer: {
    auth: authReducer,
    match: matchSlice,
    onlineUsers: onlineUsersReducer,
    smash: smashSlice,
  }
});

export default store;
