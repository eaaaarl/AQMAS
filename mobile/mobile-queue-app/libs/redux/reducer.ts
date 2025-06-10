import { configApi } from "@/features/config/api/configApi";
import { queueApi } from "@/features/queue/api/queueApi";
import { serviceApi } from "@/features/service/api/serviceApi";
import { combineReducers } from "@reduxjs/toolkit";
import { configReducer } from "./state/configSlice";

const rootReducer = combineReducers({
  config: configReducer,

  [serviceApi.reducerPath]: serviceApi.reducer,
  [configApi.reducerPath]: configApi.reducer,
  [queueApi.reducerPath]: queueApi.reducer,
});

export const apis = [serviceApi, configApi, queueApi];
export const apisReducersPath = apis.map((api) => api.reducerPath);

export default rootReducer;
