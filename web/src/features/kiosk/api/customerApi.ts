import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { CustomerApi } from "../interface/customer.interface";

const customBaseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_API_URL}/api/v1`,
});

export const customerApi = createApi({
  reducerPath: "customerApi",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    getAllCustomerType: builder.query<CustomerApi, void>({
      query: () => ({
        url: "/customer/alltype?is_show=1",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetAllCustomerTypeQuery } = customerApi;
