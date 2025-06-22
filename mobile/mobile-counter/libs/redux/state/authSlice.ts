import { AuthState, Employee, RoleInfo } from '@/features/auth/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: AuthState = {
  isAuthenticated: false,
  employee: null,
  roles: [],
  isLoading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setEmployee: (state, action: PayloadAction<Employee>) => {
      state.employee = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    setRoles: (state, action: PayloadAction<RoleInfo[]>) => {
      state.roles = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    logout: state => {
      state.isAuthenticated = false;
      state.employee = null;
      state.roles = [];
      state.error = null;
    },
    clearError: state => {
      state.error = null;
    },
  },
});

export const {
  setAuthenticated,
  setEmployee,
  setRoles,
  setLoading,
  setError,
  logout,
  clearError,
} = authSlice.actions;

export const authReducer = authSlice.reducer;
