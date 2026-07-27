import { configureStore } from '@reduxjs/toolkit';
import tabsReducer from './tabsSlice';

export const store = configureStore({
  reducer: {
    tabs: tabsReducer
  }
});
