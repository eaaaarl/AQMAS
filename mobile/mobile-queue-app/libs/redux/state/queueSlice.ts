import { CustomerTypeResponse } from "@/features/customer/api/interface";
import { Service } from "@/features/service/api/interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface QueueState {
  selectedTransactions: Service[];
  customerName: string;
  customerType: CustomerTypeResponse | null;
  showCustomerNameModal: boolean;
  showCustomerTypeModal: boolean;
  isLoading: boolean;
}

const initialState: QueueState = {
  customerName: "",
  customerType: null,
  isLoading: false,
  selectedTransactions: [],
  showCustomerNameModal: false,
  showCustomerTypeModal: false,
};

export const queueSlice = createSlice({
  name: "queue",
  initialState,
  reducers: {
    toggleTransactions: (state, action: PayloadAction<Service>) => {
      const existingIndex = state.selectedTransactions.findIndex(
        (item) => item.service_id === action.payload.service_id
      );
      if (existingIndex !== -1) {
        state.selectedTransactions.splice(existingIndex, 1);
      } else {
        state.selectedTransactions.push(action.payload);
      }
    },
    setCustomerName: (state, action: PayloadAction<string>) => {
      state.customerName = action.payload;
    },
    setCustomerType: (
      state,
      action: PayloadAction<CustomerTypeResponse | null>
    ) => {
      state.customerType = action.payload;
    },
    setShowCustomerNameModal: (state, action: PayloadAction<boolean>) => {
      state.showCustomerNameModal = action.payload;
    },
    setShowCustomerTypeModal: (state, action: PayloadAction<boolean>) => {
      state.showCustomerTypeModal = action.payload;
    },
    resetQueueState: () => initialState,
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    clearSelectedTransactions: (state) => {
      state.selectedTransactions = [];
    },
    removeTransaction: (state, action: PayloadAction<Service>) => {
      state.selectedTransactions = state.selectedTransactions.filter(
        (item) => item.service_id !== action.payload.service_id
      );
    },
  },
});

export const {
  toggleTransactions,
  setCustomerName,
  setCustomerType,
  setShowCustomerNameModal,
  setShowCustomerTypeModal,
  resetQueueState,
  setLoading,
  clearSelectedTransactions,
  removeTransaction,
} = queueSlice.actions;

export const queueReducer = queueSlice.reducer;
