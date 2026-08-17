import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    toggleSelection: (state, action) => {
      const { tableId, id } = action.payload;
      if (!state[tableId]) {
        state[tableId] = { selectedIds: [] };
      }
      
      const index = state[tableId].selectedIds.indexOf(id);
      if (index === -1) {
        state[tableId].selectedIds.push(id);
      } else {
        state[tableId].selectedIds.splice(index, 1);
      }
    },
    selectAll: (state, action) => {
      const { tableId, ids } = action.payload;
      if (!state[tableId]) {
        state[tableId] = { selectedIds: [] };
      }
      state[tableId].selectedIds = ids;
    },
    clearSelection: (state, action) => {
      const { tableId } = action.payload;
      if (state[tableId]) {
        state[tableId].selectedIds = [];
      }
    }
  }
});

export const { toggleSelection, selectAll, clearSelection } = tableSlice.actions;
export default tableSlice.reducer;
