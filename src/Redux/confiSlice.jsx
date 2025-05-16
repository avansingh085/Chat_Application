import { configureStore } from '@reduxjs/toolkit';
import userSlice from './userSlice';
import socketReducer from './socketSlice';
const store = configureStore({
  reducer: {
    Chat: userSlice,
     socket: socketReducer,
  },
});
export default store;