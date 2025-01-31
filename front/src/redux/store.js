import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import matchSlice from './slices/matchSlice';
import onlineUsersReducer from './slices/onlineUsersSlice';
import smashSlice from './slices/smashSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    match: matchSlice,
    onlineUsers: onlineUsersReducer,
    smash: smashSlice,
  }
});

export default store;
