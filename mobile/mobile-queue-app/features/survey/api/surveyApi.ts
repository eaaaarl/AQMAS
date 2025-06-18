import { RootState } from "@/libs/redux/store";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  SurveyAnswerPayload,
  SurveyAnswerPayloadResponse,
  SurveyResponse,
} from "../interface/survey.interface";
import { SurveyQuestions } from "../interface/surveyQuestion.interface";
import { SurveyQuestionDetailsResponse } from "../interface/surveyQuestionDetail.interface";

export const surveyApi = createApi({
  reducerPath: "surveyApi",
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

    if (typeof args === "string") {
      url = `${baseUrl}${args}`;
      adjustedArgs = url;
    } else {
      url = `${baseUrl}${args.url}`;
      adjustedArgs = { ...args, url };
    }

    const baseQuery = fetchBaseQuery({ baseUrl });
    return baseQuery(adjustedArgs, api, extraOptions);
  },
  tagTypes: ["Survey"],
  endpoints: (builder) => ({
    getSurveyResult: builder.query<SurveyResponse, void>({
      query: () => ({
        url: `/survey?NOW()=BETWEEN survey_from AND survey_to`,
        method: "GET",
      }),
      providesTags: ["Survey"],
    }),

    getSurveyQuestion: builder.query<SurveyQuestions, { survey_id: number }>({
      query: ({ survey_id }) => ({
        url: `/survey/questions/${survey_id}`,
        method: "GET",
      }),
      providesTags: ["Survey"],
    }),

    getSurveyQuestionsDetails: builder.query<
      SurveyQuestionDetailsResponse,
      { survey_id: number; survey_index: number }
    >({
      query: ({ survey_id, survey_index }) => ({
        url: `/survey/question-details?survey_id=${survey_id}&survey_index=${survey_index}`,
        method: "GET",
      }),
      providesTags: ["Survey"],
    }),

    createSurveyAnswer: builder.mutation<
      SurveyAnswerPayloadResponse,
      SurveyAnswerPayload
    >({
      query: (data) => ({
        url: `/survey/answer-info`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetSurveyResultQuery,
  useGetSurveyQuestionQuery,
  useGetSurveyQuestionsDetailsQuery,
  useCreateSurveyAnswerMutation,
} = surveyApi;
