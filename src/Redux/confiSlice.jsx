import { configureStore } from '@reduxjs/toolkit';
import itemsReducer from './globalSlice';
//h
const store = configureStore({
  reducer: {
    Chat: itemsReducer,
  
  },
});
export default store;