// Auth API Types
export interface AuthPayload {
  id: string;
  pin: string;
}

export interface AuthResponse {
  ghError: number;
  employeeId: number;
  message: string;
}

// Employee Types
export interface Employee {
  employee_id: number;
  employee_no: string;
  last_name: string;
  first_name: string;
  mid_name: string;
  birthday: string | null;
  employee_addr: string;
  civil_status: string;
  gender: string;
  picture: string | null;
  employee_pin: string;
  is_active: {
    type: string;
    data: number[];
  };
}

export interface EmployeeResponse {
  next: {
    page: number;
    limit: number | null;
  };
  results: Employee[];
}

export interface RoleInfo {
  counter_no: string;
  role_id: number;
  role_name: string;
  customer_group_id: number;
}

// Form Types
export interface LoginFormData {
  employeeId: string;
  pin: string;
}

export interface LoginFormErrors {
  employeeId?: string;
  pin?: string;
}

// Error Types
export interface AuthError {
  status: string | number;
  message: string;
  title?: string;
}
