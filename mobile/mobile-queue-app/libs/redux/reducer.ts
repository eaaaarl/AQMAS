import { configApi } from "@/features/config/api/configApi";
import { customerApi } from "@/features/customer/api/customerApi";
import { queueApi } from "@/features/queue/api/queueApi";
import { serviceApi } from "@/features/service/api/serviceApi";
import { combineReducers } from "@reduxjs/toolkit";
import { configReducer } from "./state/configSlice";
import { queueReducer } from "./state/queueSlice";

const rootReducer = combineReducers({
  // SLICE
  config: configReducer,
  queue: queueReducer,

  // RTK QUERY
  [serviceApi.reducerPath]: serviceApi.reducer,
  [configApi.reducerPath]: configApi.reducer,
  [queueApi.reducerPath]: queueApi.reducer,
  [customerApi.reducerPath]: customerApi.reducer,
});

export const apis = [serviceApi, configApi, queueApi, customerApi];
export const apisReducersPath = apis.map((api) => api.reducerPath);

export default rootReducer;
