import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ConfigResponse } from './interface';

export const configApi = createApi({
  reducerPath: 'configApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://192.168.1.27:4000',
    timeout: 10000, // 10 second timeout
    prepareHeaders: (headers, { getState }) => {
      headers.set('Content-Type', 'application/json');
      headers.set('Accept', 'application/json');
      return headers;
    },
  }),
  endpoints: builder => ({
    getConfig: builder.query<ConfigResponse[], void>({
      query: () => ({
        url: `/config?SectionName='Broadcast'&KeyName='Caller_Title'`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetConfigQuery } = configApi;
