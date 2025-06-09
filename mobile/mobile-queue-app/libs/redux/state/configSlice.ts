// src/store/configSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ApiConfig {
  ipAddress: string;
  port: string;
}

const initialState: ApiConfig = {
  ipAddress: "192.168.1.22",
  port: "4000",
};

export const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    setConfig: (state, action: PayloadAction<ApiConfig>) => {
      return { ...state, ...action.payload };
    },
    resetConfig: () => initialState,
  },
});

export const { setConfig, resetConfig } = configSlice.actions;
export const configReducer = configSlice.reducer;
