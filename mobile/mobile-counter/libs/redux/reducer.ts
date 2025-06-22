import { authApi } from "@/features/auth/api/authApi";
import { configApi } from "@/features/config/api/configApi";
import { combineReducers } from "@reduxjs/toolkit";
import { authReducer } from "./state/authSlice";
import { employeeReducer } from "./state/employeeSlice";

const rootReducer = combineReducers({
  employee: employeeReducer,
  auth: authReducer,

  [authApi.reducerPath]: authApi.reducer,
  [configApi.reducerPath]: configApi.reducer,
});

export const apis = [authApi, configApi];
export const apisReducersPath = apis.map((api) => api.reducerPath);

export default rootReducer;
