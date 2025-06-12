import { RootState } from "@/libs/redux/store";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { createQueueDetailsPayload, createQueuePayload2 } from "./interface";

export const queueApi = createApi({
  reducerPath: "queueApi",
  tagTypes: ["Queue"],
  baseQuery: async (args, api, extraOptions) => {
    const state = api.getState() as RootState;

    console.log("State keys:", Object.keys(state));
    console.log("Config exists:", !!state.config);

    const ipAddress = state.config?.ipAddress;
    const port = state.config?.port;
    const baseUrl = `http://${ipAddress}:${port}/api`;

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
    createQueue: builder.mutation<void, createQueuePayload2>({
      query: (data) => ({
        url: "/queue",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Queue"],
    }),

    createQueueDetails: builder.mutation<void, createQueueDetailsPayload[]>({
      query: (data) => ({
        url: "/queue/detail",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Queue"],
    }),

    countQueue: builder.query<{ count: number }, void>({
      query: () => ({
        url: "/queue/count",
        method: "GET",
      }),
      providesTags: ["Queue"],
    }),
  }),
});

export const {
  useCreateQueueMutation,
  useCreateQueueDetailsMutation,
  useCountQueueQuery,
} = queueApi;
