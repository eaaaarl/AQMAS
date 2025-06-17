import { createSlice } from "@reduxjs/toolkit";

interface customerSurveyState {
  openCustomerSurveyModal: boolean;
  name: string;
  address: string;
  contact: string;
  reference: string;
}

const initialState: customerSurveyState = {
  openCustomerSurveyModal: false,
  name: "",
  address: "",
  contact: "",
  reference: "",
};

export const customerSurveySlice = createSlice({
  name: "customerSurvey",
  initialState,
  reducers: {
    setOpenCustomerSurveyModal: (state, action) => {
      state.openCustomerSurveyModal = action.payload;
    },
    setName: (state, action) => {
      state.name = action.payload;
    },
    setAddress: (state, action) => {
      state.address = action.payload;
    },
    setContact: (state, action) => {
      state.contact = action.payload;
    },
    setReference: (state, action) => {
      state.reference = action.payload;
    },

    resetCustomerSurvey: (state) => {
      state.address = "";
      state.name = "";
      state.reference = "";
      state.contact = "";
    },
  },
});

export const {
  setAddress,
  setContact,
  setName,
  setOpenCustomerSurveyModal,
  setReference,
  resetCustomerSurvey,
} = customerSurveySlice.actions;

export const customerSurveyReducer = customerSurveySlice.reducer;
