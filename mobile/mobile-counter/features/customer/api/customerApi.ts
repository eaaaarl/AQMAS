import { RootState } from '@/libs/redux/store';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CustomerGroup } from './interface';

export const customerApi = createApi({
  reducerPath: 'customerApi',
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
  tagTypes: ['CustomerGroup'],
  endpoints: builder => ({
    getCustomersGroup: builder.query<
      CustomerGroup[],
      { customerGroupId: number }
    >({
      query: ({ customerGroupId }) => ({
        url: `/customer/group/${customerGroupId}`,
        method: 'GET',
      }),
      providesTags: ['CustomerGroup'],
    }),
  }),
});

export const { useGetCustomersGroupQuery } = customerApi;
