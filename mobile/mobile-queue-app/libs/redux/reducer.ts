import { serviceApi } from "@/features/service/api/serviceApi";
import { combineReducers } from "@reduxjs/toolkit";

const rootReducer = combineReducers({
  [serviceApi.reducerPath]: serviceApi.reducer,
});

export const apis = [serviceApi];
export const apisReducersPath = apis.map((api) => api.reducerPath);

export default rootReducer;
