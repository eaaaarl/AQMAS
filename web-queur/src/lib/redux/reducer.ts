import { configApi } from "@/features/config/api/configApi";
import { serviceApi } from "@/features/service/api/serviceApi";
import { combineReducers } from "@reduxjs/toolkit";
import { modalReducer } from "./state/modalSlice";

const rootReducer = combineReducers({
  modal: modalReducer,

  [serviceApi.reducerPath]: serviceApi.reducer,
  [configApi.reducerPath]: configApi.reducer,
});

export const apis = [serviceApi, configApi];
export const apisReducerPath = apis.map((api) => api.reducerPath);

export default rootReducer;
