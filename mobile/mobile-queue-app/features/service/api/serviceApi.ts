import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ServiceResponse } from "./interface";

const customBaseQuery = fetchBaseQuery({
  baseUrl: `http://192.168.1.13:3000/api` + "/queer",
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
