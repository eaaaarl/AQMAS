import { RootState } from "@/libs/redux/store";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CustomerTypeParams, CustomerTypeResponse } from "./interface";

export const customerApi = createApi({
  reducerPath: "customerApi",
  tagTypes: ["Customer"],
  baseQuery: async (args, api, extraOptions) => {
    const state = api.getState() as RootState;

    console.log("State keys:", Object.keys(state));
    console.log("Config exists:", !!state.config);

    const ipAddress = state.config?.ipAddress;
    const port = state.config?.port;
    const baseUrl = `http://${ipAddress}:${port}/customer`;

    console.log("Using IP:", ipAddress);
    console.log("Using Port:", port);
    console.log("Constructed baseUrl:", baseUrl);

    let url: string;
    let adjustedArgs: any;

    if (typeof args === "string") {
      url = `${baseUrl}${args}`;
      adjustedArgs = url;
    } else {
      url = `${baseUrl}${args.url}`;
      adjustedArgs = { ...args, url };
    }

    const baseQuery = fetchBaseQuery({ baseUrl });
    return baseQuery(adjustedArgs, api, extraOptions);
  },
  endpoints: (builder) => ({
    getCustomerType: builder.query<CustomerTypeResponse[], CustomerTypeParams>({
      query: ({ is_show }) => ({
        url: `/alltype?is_show=${is_show}`,
        method: "GET",
      }),
      providesTags: ["Customer"],
    }),
  }),
});

export const { useGetCustomerTypeQuery } = customerApi;
