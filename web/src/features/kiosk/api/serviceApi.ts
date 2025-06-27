import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ServiceApiResponse } from "../interface/service.interface";

const customBaseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_API_URL}/api/v1`,
});

export const serviceApi = createApi({
  reducerPath: "serviceApi",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    getServices: builder.query<ServiceApiResponse, void>({
      query: () => ({
        url: "/service",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetServicesQuery } = serviceApi;
