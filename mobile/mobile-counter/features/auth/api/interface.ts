export interface AuthResponse {
  ghError: number;
  employeeId: number;
  message: string;
}

export interface AuthPayload {
  id: string;
  pin: string;
}
