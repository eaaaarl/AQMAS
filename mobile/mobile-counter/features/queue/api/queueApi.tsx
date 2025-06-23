import { RootState } from '@/libs/redux/store';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Ticket } from './interface';

export const queueApi = createApi({
  reducerPath: 'queueApi',
  baseQuery: async (args, api, extraOptions) => {
    const state = api.getState() as RootState;

    // console.log("State keys:", Object.keys(state));
    // console.log("Config exists:", !!state.config);

    const ipAddress = state.config?.ipAddress;
    const port = state.config?.port;
    const baseUrl = `http://${ipAddress}:${port}`;

    // console.log("Using IP:", ipAddress);
    // console.log("Using Port:", port);
    // console.log("Constructed baseUrl:", baseUrl);

    let url: string;
    let adjustedArgs: any;

    if (typeof args === 'string') {
      url = `${baseUrl}${args}`;
      adjustedArgs = url;
    } else {
      url = `${baseUrl}${args.url}`;
      adjustedArgs = { ...args, url };
    }

    const baseQuery = fetchBaseQuery({
      baseUrl,
      timeout: 10000,
      prepareHeaders: (headers, { getState }) => {
        headers.set('Content-Type', 'application/json');
        headers.set('Accept', 'application/json');
        return headers;
      },
    });
    return baseQuery(adjustedArgs, api, extraOptions);
  },
  tagTypes: ['Queue'],
  endpoints: builder => ({
    getQueue: builder.query<
      Ticket,
      { service_id: number[]; type_id: number[] }
    >({
      query: ({ service_id, type_id }) => ({
        url: `/queue/available?DATE(queue.trans_date)=DATE(NOW())&employee_id=IS NULL&queue_detail.service_id=IN(${service_id})&queue.type_id=IN (${type_id})`,
        method: 'GET',
      }),
      providesTags: ['Queue'],
    }),
  }),
});

export const { useGetQueueQuery } = queueApi;
