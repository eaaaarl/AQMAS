import { configApi } from "@/features/config/api/configApi";
import { serviceApi } from "@/features/kiosk/api/serviceApi";
import { combineReducers } from "@reduxjs/toolkit";
import { customerApi } from "@/features/kiosk/api/customerApi";
import { queueApi } from "@/features/kiosk/api/queueApi";
import { uiReducer } from "./state/uiSlice";

const rootReducer = combineReducers({
  ui: uiReducer,

  [serviceApi.reducerPath]: serviceApi.reducer,
  [configApi.reducerPath]: configApi.reducer,
  [customerApi.reducerPath]: customerApi.reducer,
  [queueApi.reducerPath]: queueApi.reducer,
});

export const apis = [serviceApi, configApi, customerApi, queueApi];
export const apisReducerPath = apis.map((api) => api.reducerPath);

export default rootReducer;
