import { createSlice } from "@reduxjs/toolkit";

export interface ConfigState {
  serverIp: string;
  serverPort: string;
}

const initialState: ConfigState = {
  serverIp: "",
  serverPort: "",
};

const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    setServerIp(state, action) {
      state.serverIp = action.payload;
    },
    setServerPort(state, action) {
      state.serverPort = action.payload;
    },
    resetConfig(state) {
      state.serverIp = "";
      state.serverPort = "";
    },
  },
});

export const { setServerIp, setServerPort, resetConfig } = configSlice.actions;
export const configReducer = configSlice.reducer;
