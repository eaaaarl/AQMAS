import { configApi } from "@/features/config/api/configApi";
import { customerApi } from "@/features/customer/api/customerApi";
import { deviceApi } from "@/features/device/api/deviceApi";
import { queueApi } from "@/features/queue/api/queueApi";
import { serviceApi } from "@/features/service/api/serviceApi";
import { surveyApi } from "@/features/survey/api/surveyApi";
import { combineReducers } from "@reduxjs/toolkit";
import { configReducer } from "./state/configSlice";
import { customerSurveyReducer } from "./state/customerSurveySlice";
import { surveyReducer } from "./state/surveySlice";

const rootReducer = combineReducers({
  // SLICE
  config: configReducer,
  survey: surveyReducer,
  customerSurvey: customerSurveyReducer,

  // RTK QUERY
  [serviceApi.reducerPath]: serviceApi.reducer,
  [configApi.reducerPath]: configApi.reducer,
  [queueApi.reducerPath]: queueApi.reducer,
  [customerApi.reducerPath]: customerApi.reducer,
  [surveyApi.reducerPath]: surveyApi.reducer,
  [deviceApi.reducerPath]: deviceApi.reducer,
});

export const apis = [
  serviceApi,
  configApi,
  queueApi,
  customerApi,
  surveyApi,
  deviceApi,
];
export const apisReducersPath = apis.map((api) => api.reducerPath);

export default rootReducer;
