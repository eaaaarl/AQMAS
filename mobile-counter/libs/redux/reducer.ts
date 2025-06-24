import { authApi } from '@/features/auth/api/authApi';
import { configApi } from '@/features/config/api/configApi';
import { customerApi } from '@/features/customer/api/customerApi';
import { queueApi } from '@/features/queue/api/queueApi';
import { combineReducers } from '@reduxjs/toolkit';
import { configReducer } from './state/configSlice';
import { employeeReducer } from './state/employeeSlice';
import { queueReducer } from './state/queueSlice';
import { settingsReducer } from './state/settingsSlice';

const rootReducer = combineReducers({
  employee: employeeReducer,
  config: configReducer,
  settings: settingsReducer,
  queue: queueReducer,

  [authApi.reducerPath]: authApi.reducer,
  [configApi.reducerPath]: configApi.reducer,
  [customerApi.reducerPath]: customerApi.reducer,
  [queueApi.reducerPath]: queueApi.reducer,
});

export const apis = [authApi, configApi, customerApi, queueApi];
export const apisReducersPath = apis.map(api => api.reducerPath);

export default rootReducer;
