import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ServicesApiResponse } from "./interface";

const customBaseQuery = fetchBaseQuery({
  baseUrl: `http://192.168.1.22:4000`,
});

export const serviceApi = createApi({
  reducerPath: "serviceApi",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    getServices: builder.query<ServicesApiResponse, void>({
      query: () => ({
        url: "/service",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetServicesQuery } = serviceApi;
