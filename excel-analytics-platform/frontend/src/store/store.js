import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import excelReducer from './slices/excelSlice';
import uiReducer from './slices/uiSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    excel: excelReducer,
    ui: uiReducer,
    users: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});