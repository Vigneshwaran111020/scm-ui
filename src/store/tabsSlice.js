import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  openTabs: [], // Array of { id, title, type, params }
  activeTabId: null,
  pageState: {} // Cached state keyed by tabId
};

const tabsSlice = createSlice({
  name: 'tabs',
  initialState,
  reducers: {
    openTab: (state, action) => {
      const newTab = action.payload;
      const existingTabIndex = state.openTabs.findIndex(tab => tab.id === newTab.id);
      
      if (existingTabIndex === -1) {
        state.openTabs.push(newTab);
      }
      state.activeTabId = newTab.id;
    },
    closeTab: (state, action) => {
      const tabId = action.payload;
      const tabIndex = state.openTabs.findIndex(tab => tab.id === tabId);
      
      if (tabIndex !== -1) {
        state.openTabs.splice(tabIndex, 1);
        
        // Remove cached state to free memory
        delete state.pageState[tabId];

        if (state.activeTabId === tabId) {
          if (state.openTabs.length > 0) {
            // Activate the nearest available tab
            const nextActive = state.openTabs[tabIndex] || state.openTabs[tabIndex - 1];
            state.activeTabId = nextActive.id;
          } else {
            state.activeTabId = null;
          }
        }
      }
    },
    setActiveTab: (state, action) => {
      state.activeTabId = action.payload;
    },
    closeAllTabs: (state) => {
      state.openTabs = [];
      state.activeTabId = null;
      state.pageState = {}; // Clear all cached page states
    },
    updatePageState: (state, action) => {
      const { tabId, data } = action.payload;
      if (!state.pageState[tabId]) {
        state.pageState[tabId] = {};
      }
      state.pageState[tabId] = { ...state.pageState[tabId], ...data };
    }
  }
});

export const { openTab, closeTab, setActiveTab, closeAllTabs, updatePageState } = tabsSlice.actions;
export default tabsSlice.reducer;
