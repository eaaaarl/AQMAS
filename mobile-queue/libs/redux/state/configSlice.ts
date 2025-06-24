import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ApiConfig {
  ipAddress: string;
  port: string;
}

const initialState: ApiConfig = {
  ipAddress: "",
  port: "",
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
