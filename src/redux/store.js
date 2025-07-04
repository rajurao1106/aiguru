// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './messagesSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});
