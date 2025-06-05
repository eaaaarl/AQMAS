import { serviceApi } from "@/features/service/api/serviceApi";
import { combineReducers } from "@reduxjs/toolkit";
import { configReducer } from "./state/configSlice";

const rootReducer = combineReducers({
  config: configReducer,

  [serviceApi.reducerPath]: serviceApi.reducer,
});

export const apis = [serviceApi];
export const apisReducersPath = apis.map((api) => api.reducerPath);

export default rootReducer;
