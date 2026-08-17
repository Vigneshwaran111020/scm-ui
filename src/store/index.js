import { configureStore } from '@reduxjs/toolkit';
import tabsReducer from './tabsSlice';
import tableReducer from './tableSlice';

export const store = configureStore({
  reducer: {
    tabs: tabsReducer,
    table: tableReducer
  }
});
