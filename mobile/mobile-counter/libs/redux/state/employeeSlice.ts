import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EmployeeState {
  employee_id: number | string;
  employee_no?: string;
  last_name?: string;
  first_name?: string;
  mid_name?: string;
  birthday?: string;
  employee_addr?: string;
  civil_status?: string;
  gender?: string;
  picture?: string;
  employee_pin?: string;
  is_active?: boolean;
}

const initialState: EmployeeState = {
  employee_id: '',
  birthday: '',
  civil_status: '',
  employee_addr: '',
  employee_no: '',
  employee_pin: '',
  first_name: '',
  gender: '',
  is_active: false,
  last_name: '',
  mid_name: '',
  picture: '',
};

export const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    setEmployee: (state, action: PayloadAction<EmployeeState>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    removeEmployee: state => {
      return initialState;
    },
  },
});

export const { setEmployee, removeEmployee } = employeeSlice.actions;

export const employeeReducer = employeeSlice.reducer;
