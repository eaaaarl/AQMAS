import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  AllServiceCountApi,
  ByServiceCountApi,
  CallQueueApi,
  CallQueuePayload,
  QueueCountApi,
} from "../interface/queue.interface";

const customBaseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_API_URL}/api/v1`,
});

export const queueApi = createApi({
  reducerPath: "queueApi",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    callQueue: builder.mutation<CallQueueApi, CallQueuePayload>({
      query: (payload) => ({
        url: "/queue/with-detail",
        method: "POST",
        body: payload,
      }),
    }),

    getQueueCount: builder.query<QueueCountApi, { type_id: string }>({
      query: ({ type_id }) => ({
        url: `/queue/count?Date=CURDATE()&type_id=${type_id}`,
        method: "GET",
      }),
    }),

    getAllServiceCount: builder.query<AllServiceCountApi, void>({
      query: () => ({
        url: "/queue/allservicecount",
        method: "GET",
      }),
    }),
    getByServiceCount: builder.query<ByServiceCountApi, { service_id: number }>(
      {
        query: ({ service_id }) => ({
          url: `/queue/byservicecount/${service_id}`,
          method: "GET",
        }),
      }
    ),
  }),
});

export const {
  useCallQueueMutation,
  useGetAllServiceCountQuery,
  useGetByServiceCountQuery,
  useGetQueueCountQuery,
} = queueApi;
