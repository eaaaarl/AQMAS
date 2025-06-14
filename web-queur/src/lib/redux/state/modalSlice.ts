import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface ModalState {
  open: boolean;
}

const initialState: ModalState = {
  open: false,
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    setModalOpen: (state, action: PayloadAction<boolean>) => {
      state.open = action.payload;
    },
    resetModal: () => initialState,
  },
});

export const { resetModal, setModalOpen } = modalSlice.actions;

export const modalReducer = modalSlice.reducer;
