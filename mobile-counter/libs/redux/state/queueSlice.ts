import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface QueueService {
  button_caption: string;
}

interface QueueData {
  ticketNo: string;
  customerName: string;
  services: QueueService[];
  customerType: string;
  remaining?: number;
}

interface QueueState {
  // Current active queue (when ticket is called)
  employeeId?: number;
  counterNo?: number;
  ticketNo?: string;
  customerName?: string;
  services?: QueueService[];
  customerType?: string;

  // Queued data (next ticket waiting to be called)
  queuedData?: QueueData | null;
}

const initialState: QueueState = {
  employeeId: undefined,
  counterNo: undefined,
  ticketNo: undefined,
  customerName: undefined,
  services: undefined,
  customerType: undefined,
  queuedData: null,
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

    setQueuedData: (state, action: PayloadAction<QueueData | null>) => {
      state.queuedData = action.payload;
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

    resetAll: state => {
      return initialState;
    },
  },
});
export const {
  setQueue,
  setQueuedData,
  resetQueue,
  resetQueuedData,
  resetAll,
} = queueSlice.actions;

export const queueReducer = queueSlice.reducer;
