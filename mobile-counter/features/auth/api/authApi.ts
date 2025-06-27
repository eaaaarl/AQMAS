import { RootState } from '@/libs/redux/store';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  AuthPayload,
  AuthResponse,
  EmployeeResponse,
  EmployeeRoleTaskService,
  RoleInfo,
} from '../types';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: async (args, api, extraOptions) => {
    const state = api.getState() as RootState;

    // console.log("State keys:", Object.keys(state));
    // console.log("Config exists:", !!state.config);

    const ipAddress = state.config?.ipAddress;
    const port = state.config?.port;
    const baseUrl = `http://${ipAddress}:${port}`;

    // console.log("Using IP:", ipAddress);
    // console.log("Using Port:", port);
    // console.log("Constructed baseUrl:", baseUrl);

    let url: string;
    let adjustedArgs: any;

    if (typeof args === 'string') {
      url = `${baseUrl}${args}`;
      adjustedArgs = url;
    } else {
      url = `${baseUrl}${args.url}`;
      adjustedArgs = { ...args, url };
    }

    const baseQuery = fetchBaseQuery({
      baseUrl,
      timeout: 10000,
      prepareHeaders: (headers, { getState }) => {
        headers.set('Content-Type', 'application/json');
        headers.set('Accept', 'application/json');
        return headers;
      },
    });
    return baseQuery(adjustedArgs, api, extraOptions);
  },
  tagTypes: ['Employee', 'Role'],
  endpoints: builder => ({
    employeeLogin: builder.mutation<AuthResponse, AuthPayload>({
      query: data => ({
        url: '/employee/login',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Employee', 'Role'],
    }),

    getEmployeeInfo: builder.query<EmployeeResponse, { empId: number }>({
      query: ({ empId }) => ({
        url: `/employee?employee_id=${empId}`,
        method: 'GET',
      }),
      providesTags: ['Employee'],
    }),

    getEmployeeRole: builder.query<RoleInfo[], { emp_id: number }>({
      query: ({ emp_id }) => ({
        url: `/employee/role?NOW()=BETWEEN date_from AND date_to&employee_schedule.employee_id=${emp_id}`,
        method: 'GET',
      }),
      providesTags: ['Role'],
    }),

    getEmployeeRoleDefault: builder.query<RoleInfo[], { emp_id: number }>({
      query: ({ emp_id }) => ({
        url: `/employee/role?default_sched=TRUE&employee_schedule.employee_id=${emp_id}&limit=1`,
        method: 'GET',
      }),
      providesTags: ['Role'],
    }),

    getEmployeeRoleTask: builder.query<
      EmployeeRoleTaskService[],
      { customerGroup: number }
    >({
      query: ({ customerGroup }) => ({
        url: `/employee/role/${customerGroup}/tasks`,
        method: 'GET',
      }),
      providesTags: ['Role'],
    }),

    getEmployeeProfileImage: builder.query<Blob, { imageUrl: string }>({
      query: ({ imageUrl }) => ({
        url: `/${imageUrl}`,
        method: 'GET',
        responseHandler: 'blob',
        headers: {
          Accept: 'image/*',
        },
      }),
    }),
    
  }),
});

export const {
  useEmployeeLoginMutation,
  useGetEmployeeInfoQuery,
  useGetEmployeeRoleQuery,
  useGetEmployeeRoleDefaultQuery,
  useGetEmployeeRoleTaskQuery,
  useGetEmployeeProfileImageQuery,
} = authApi;
