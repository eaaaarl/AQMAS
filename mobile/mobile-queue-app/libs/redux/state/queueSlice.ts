import { CustomerTypeResponse } from "@/features/customer/api/interface";
import { Service } from "@/features/service/api/interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface QueueState {
  customerType: CustomerTypeResponse | null;
  customerName: string;
  selectedTransactions: Service[];
  showCustomerTypeModal: boolean;
  showCustomerNameModal: boolean;
}

const initialState: QueueState = {
  customerType: null,
  customerName: "",
  selectedTransactions: [],
  showCustomerTypeModal: false,
  showCustomerNameModal: false,
};

export const queueSlice = createSlice({
  name: "queue",
  initialState,
  reducers: {
    setCustomerType: (
      state,
      action: PayloadAction<CustomerTypeResponse | null>
    ) => {
      state.customerType = action.payload;
    },
    setCustomerName: (state, action: PayloadAction<string>) => {
      state.customerName = action.payload;
    },
    toggleTransaction: (state, action: PayloadAction<Service>) => {
      const existingIndex = state.selectedTransactions.findIndex(
        (item) => item.service_id === action.payload.service_id
      );
      if (existingIndex !== -1) {
        state.selectedTransactions.splice(existingIndex, 1);
      } else {
        state.selectedTransactions.push(action.payload);
      }
    },
    setTransactions: (state, action: PayloadAction<Service[]>) => {
      state.selectedTransactions = action.payload;
    },
    showCustomerTypeModal: (state, action: PayloadAction<boolean>) => {
      state.showCustomerTypeModal = action.payload;
    },
    showCustomerNameModal: (state, action: PayloadAction<boolean>) => {
      state.showCustomerNameModal = action.payload;
    },
    resetQueueForm: () => initialState,
  },
});

export const {
  setCustomerType,
  setCustomerName,
  toggleTransaction,
  setTransactions,
  showCustomerTypeModal,
  showCustomerNameModal,
  resetQueueForm,
} = queueSlice.actions;

export const queueReducer = queueSlice.reducer;
