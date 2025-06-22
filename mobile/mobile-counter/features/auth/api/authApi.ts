import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  AuthPayload,
  AuthResponse,
  EmployeeResponse,
  RoleInfo
} from "../types";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://192.168.1.27:4000",
    timeout: 10000, // 10 second timeout
    prepareHeaders: (headers, { getState }) => {
      headers.set("Content-Type", "application/json");
      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  tagTypes: ['Employee', 'Role'],
  endpoints: (builder) => ({
    employeeLogin: builder.mutation<AuthResponse, AuthPayload>({
      query: (data) => ({
        url: "/employee/login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['Employee', 'Role'],
    }),

    getEmployeeInfo: builder.query<EmployeeResponse, { empId: number }>({
      query: ({ empId }) => ({
        url: `/employee?employee_id=${empId}`,
        method: "GET",
      }),
      providesTags: ['Employee'],
    }),

    getEmployeeRole: builder.query<RoleInfo[], { emp_id: number }>({
      query: ({ emp_id }) => ({
        url: `/employee/role?default_sched=TRUE&employee_schedule.employee_id=${emp_id}&limit=1`,
        method: "GET",
      }),
      providesTags: ['Role'],
    }),
  }),
});

export const {
  useEmployeeLoginMutation,
  useGetEmployeeInfoQuery,
  useGetEmployeeRoleQuery,
} = authApi;
