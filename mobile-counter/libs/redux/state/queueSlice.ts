import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface QueueService {
  button_caption: string;
}

export interface QueueDData {
  ticketNo: string;
  customerName: string;
  services: QueueService[];
  customerType: string;
  remaining?: number;
}

export interface SkippedData {
  trans_id: string;
  trans_date: string;
  customer_name: string;
  time_start: string;
  services?: QueueService[];
  customerType?: string;
}

interface QueueState {
  employeeId?: number;
  counterNo?: number;
  ticketNo?: string;
  customerName?: string;
  services?: QueueService[];
  customerType?: string;

  queuedData?: QueueDData | null;
  skippedData?: SkippedData[] | null;
}

const initialState: QueueState = {
  employeeId: undefined,
  counterNo: undefined,
  ticketNo: undefined,
  customerName: undefined,
  services: undefined,
  customerType: undefined,
  queuedData: null,
  skippedData: null,
};

export const queueSlice = createSlice({
  name: 'queue',
  initialState,
  reducers: {
    setQueue: (
      state,
      action: PayloadAction<{
        employeeId: number;
        counterNo: number;
        ticketNo: string;
        customerName: string;
        services: QueueService[];
        customerType: string;
      }>
    ) => {
      state.employeeId = action.payload.employeeId;
      state.counterNo = action.payload.counterNo;
      state.ticketNo = action.payload.ticketNo;
      state.customerName = action.payload.customerName;
      state.services = action.payload.services;
      state.customerType = action.payload.customerType;
    },

    setQueuedData: (state, action: PayloadAction<QueueDData | null>) => {
      state.queuedData = action.payload;
    },

    setSkippedData: (state, action: PayloadAction<SkippedData[] | null>) => {
      state.skippedData = action.payload;
    },

    setSkippedTicket: (
      state,
      action: PayloadAction<{
        trans_id: string;
        trans_date: string;
        customer_name: string;
        time_start: string;
        services: QueueService[];
        customerType: string;
      }>
    ) => {
      const newSkippedTicket = action.payload;
      state.skippedData = state.skippedData || [];
      state.skippedData.push(newSkippedTicket);
    },

    removeSkippedTicket: (
      state,
      action: PayloadAction<string> // trans_id of the ticket to remove
    ) => {
      if (state.skippedData) {
        state.skippedData = state.skippedData.filter(
          ticket => ticket.trans_id !== action.payload
        );
      }
    },

    resetQueue: state => {
      state.employeeId = undefined;
      state.counterNo = undefined;
      state.ticketNo = undefined;
      state.customerName = undefined;
      state.services = undefined;
      state.customerType = undefined;
    },

    resetQueuedData: state => {
      state.queuedData = null;
    },

    resetSkippedData: state => {
      state.skippedData = null;
    },

    resetAll: state => {
      return initialState;
    },
  },
});
export const {
  setQueue,
  setQueuedData,
  setSkippedData,
  setSkippedTicket,
  removeSkippedTicket,
  resetQueue,
  resetQueuedData,
  resetSkippedData,
  resetAll,
} = queueSlice.actions;

export const queueReducer = queueSlice.reducer;
