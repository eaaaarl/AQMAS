import { RootState } from '@/libs/redux/store';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { DeviceApi, DeviceInfo } from '../interface/device.interface';

export const deviceApi = createApi({
  reducerPath: 'deviceApi',
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
  tagTypes: ['Device'],
  endpoints: builder => ({
    registeredDevice: builder.mutation<DeviceApi, DeviceInfo>({
      query: payload => ({
        url: '/mobile-device/create',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Device'],
    }),

    checkDevice: builder.query<
      { registered: boolean },
      { type: number; id: string }
    >({
      query: ({ id, type }) => ({
        url: `/mobile-device/check-auth/${type}/${id}`,
        method: 'GET',
      }),
    }),

    verifyDevice: builder.mutation<
      { ghError: number; verified: boolean; ghMessage: string },
      { id: string; passcode: string }
    >({
      query: ({ id, passcode }) => ({
        url: `/mobile-device/verify/${id}/1/${passcode}`,
        method: 'PUT',
      }),
    }),
  }),
});

export const {
  useRegisteredDeviceMutation,
  useCheckDeviceQuery,
  useLazyCheckDeviceQuery,
  useVerifyDeviceMutation,
} = deviceApi;
