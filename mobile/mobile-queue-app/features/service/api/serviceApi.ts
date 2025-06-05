import { BACKEND_CONFIG } from "@/constant/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ServiceResponse } from "./interface";

const customBaseQuery = fetchBaseQuery({
  baseUrl: `${BACKEND_CONFIG.API_URL}/api` + "/queer",
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
