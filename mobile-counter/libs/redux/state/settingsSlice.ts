import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  customerTypes: number[];
  services: number[];
}

const initialState: SettingsState = {
  customerTypes: [],
  services: [],
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setCustomerTypes: (state, action: PayloadAction<number[]>) => {
      state.customerTypes = action.payload;
    },
    setServices: (state, action: PayloadAction<number[]>) => {
      state.services = action.payload;
    },
    updateCustomerType: (
      state,
      action: PayloadAction<{ typeId: number; enabled: boolean }>
    ) => {
      const { typeId, enabled } = action.payload;
      if (enabled) {
        if (!state.customerTypes.includes(typeId)) {
          state.customerTypes.push(typeId);
        }
      } else {
        state.customerTypes = state.customerTypes.filter(id => id !== typeId);
      }
    },
    updateService: (
      state,
      action: PayloadAction<{ serviceId: number; enabled: boolean }>
    ) => {
      const { serviceId, enabled } = action.payload;
      if (enabled) {
        if (!state.services.includes(serviceId)) {
          state.services.push(serviceId);
        }
      } else {
        state.services = state.services.filter(id => id !== serviceId);
      }
    },
    resetSettings: state => {
      state.customerTypes = [];
      state.services = [];
    },
  },
});

export const {
  setCustomerTypes,
  setServices,
  updateCustomerType,
  updateService,
  resetSettings,
} = settingsSlice.actions;

export const settingsReducer = settingsSlice.reducer;
