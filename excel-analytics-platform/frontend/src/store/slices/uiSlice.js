import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    isSidebarOpen: true,
    activeSection: 'dashboard',
    modal: {
      isOpen: false,
      type: null,
      data: null,
    },
    toast: {
      isVisible: false,
      message: '',
      type: 'success', // success, error, warning, info
    },
    theme: 'light',
  },
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setActiveSection: (state, action) => {
      state.activeSection = action.payload;
    },
    openModal: (state, action) => {
      state.modal.isOpen = true;
      state.modal.type = action.payload.type;
      state.modal.data = action.payload.data || null;
    },
    closeModal: (state) => {
      state.modal.isOpen = false;
      state.modal.type = null;
      state.modal.data = null;
    },
    showToast: (state, action) => {
      state.toast.isVisible = true;
      state.toast.message = action.payload.message;
      state.toast.type = action.payload.type || 'success';
    },
    hideToast: (state) => {
      state.toast.isVisible = false;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
  },
});

export const {
  toggleSidebar,
  setActiveSection,
  openModal,
  closeModal,
  showToast,
  hideToast,
  toggleTheme,
} = uiSlice.actions;

export default uiSlice.reducer;