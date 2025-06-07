import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ServiceResponse } from "./interface";

const customBaseQuery = fetchBaseQuery({
  baseUrl: `http://192.168.56.1:3000/api` + "/queer",
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
