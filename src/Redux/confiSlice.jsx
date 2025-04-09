import { configureStore } from '@reduxjs/toolkit';
import itemsReducer from './globalSlice';
import socketReducer from './socketSlice';
const store = configureStore({
  reducer: {
    Chat: itemsReducer,
     socket: socketReducer,
  },
});
export default store;