import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ServiceResponse } from "./interface";

const customBaseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_API_BASE_URL}/api` + "/queer",
});

export const serviceApi = createApi({
  reducerPath: "serviceApi",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    getServices: builder.query<ServiceResponse[], void>({
      query: () => ({
        url: "/service",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetServicesQuery } = serviceApi;
