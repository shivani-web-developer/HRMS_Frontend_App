import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../store/slice/userSlice';
import { apiApi } from '../auth/authApi';
import { attendanceApi } from '../attendance/attendanceApi';
import { employeeApi } from '../employee/employeeApi';

export const store = configureStore({
  reducer: {
    user: userReducer, 
    [apiApi.reducerPath]: apiApi.reducer,
    [attendanceApi.reducerPath]: attendanceApi.reducer,
    [employeeApi.reducerPath]: employeeApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiApi.middleware, attendanceApi.middleware, employeeApi.middleware),
  });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
