import { RootState } from '@/libs/redux/store';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { QueueDetail, Ticket, TickitSkipped } from './interface';

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
    callQueue: builder.mutation<
      { message: string },
      { ticketNo: string; employeeId: number; counterNo: number }
    >({
      query: ({ counterNo, employeeId, ticketNo }) => ({
        url: `/queue/call/${ticketNo}`,
        method: 'PUT',
        body: {
          employeeId,
          counterNo,
        },
      }),
      invalidatesTags: ['Queue'],
    }),

    callQueueFinish: builder.mutation<void, { ticketNo: string }>({
      query: ({ ticketNo }) => ({
        url: `/queue/finish/${ticketNo}`,
        method: 'PUT',
      }),
      invalidatesTags: ['Queue'],
    }),

    callQueueRecall: builder.mutation<void, { ticketNo: string }>({
      query: ({ ticketNo }) => ({
        url: `/queue/recall/${ticketNo}`,
        method: 'PUT',
      }),
      invalidatesTags: ['Queue'],
    }),

    callQueueSkip: builder.mutation<void, { ticketNo: string }>({
      query: ({ ticketNo }) => ({
        url: `/queue/skip/${ticketNo}`,
        method: 'PUT',
      }),
      invalidatesTags: ['Queue'],
    }),

    getQueue: builder.query<
      Ticket,
      { service_id: number[]; type_id: number[] }
    >({
      query: ({ service_id, type_id }) => {
        const serviceIds = service_id.length > 0 ? service_id.join(',') : '';
        const typeIds = type_id.length > 0 ? type_id.join(',') : '';
        return {
          url: `/queue/available?DATE(queue.trans_date)=DATE(NOW())&employee_id=IS NULL&queue_detail.service_id=IN (${serviceIds})&queue.type_id=IN (${typeIds})`,
          method: 'GET',
        };
      },
      providesTags: ['Queue'],
    }),

    getQueueByID: builder.query<Ticket, { ticketNo: string }>({
      query: ({ ticketNo }) => ({
        url: `/queue/${ticketNo}`,
        method: 'GET',
      }),
      providesTags: ['Queue'],
    }),

    getQueueDetailEmpId: builder.query<QueueDetail[], { employee_id: number }>({
      query: ({ employee_id }) => ({
        url: `/queue/detail/${employee_id}`,
        method: 'GET',
      }),
      providesTags: ['Queue'],
    }),

    getQueueQueued: builder.query<Ticket, { employeeId: number }>({
      query: ({ employeeId }) => ({
        url: `/queue/queued/${employeeId}`,
        method: 'GET',
      }),
      providesTags: ['Queue'],
    }),

    getQueueSkipped: builder.query<TickitSkipped[], { employeeId: number }>({
      query: ({ employeeId }) => ({
        url: `/queue/skipped/${employeeId}`,
        method: 'GET',
      }),
      providesTags: ['Queue'],
    }),

  }),
});

export const {
  useGetQueueQuery,
  useGetQueueDetailEmpIdQuery,
  useCallQueueMutation,
  useCallQueueFinishMutation,
  useCallQueueRecallMutation,
  useGetQueueQueuedQuery,
  useCallQueueSkipMutation,
  useGetQueueSkippedQuery,
  useGetQueueByIDQuery,
  useLazyGetQueueByIDQuery
} = queueApi;
