import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { EmployeeResponse, RoleInfo } from "./emp.interface";
import { AuthPayload, AuthResponse } from "./interface";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://192.168.1.27:4000",
    prepareHeaders: (headers, { getState }) => {
      headers.set("Content-Type", "application/json");
      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    employeeLogin: builder.mutation<AuthResponse, AuthPayload>({
      query: (data) => {
        return {
          url: "/employee/login",
          method: "POST",
          body: data,
        };
      },
    }),

    getEmployeeInfo: builder.query<EmployeeResponse, { empId: number }>({
      query: ({ empId }) => ({
        url: `/employee?employee_id=${empId}`,
        method: "GET",
      }),
    }),

    getEmployeeRole: builder.query<RoleInfo[], { emp_id: number }>({
      query: ({ emp_id }) => ({
        url: `/employee/role?default_sched=TRUE&employee_schedule.employee_id=${emp_id}&limit=1`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useEmployeeLoginMutation,
  useGetEmployeeInfoQuery,
  useGetEmployeeRoleQuery,
} = authApi;
