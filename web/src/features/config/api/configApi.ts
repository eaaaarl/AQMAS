import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import type { ConfigApiResponse } from "./interface";

const customBaseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_API_URL}/api/v1`,
});

export const configApi = createApi({
  reducerPath: "configApi",
  baseQuery: customBaseQuery,
  tagTypes: ["config"],
  endpoints: (builder) => ({
    getConfigs: builder.query<ConfigApiResponse[], void>({
      query: () => ({
        url: "/config",
        method: "GET",
      }),
      providesTags: ["config"],
    }),
  }),
});

export const { useGetConfigsQuery } = configApi;
