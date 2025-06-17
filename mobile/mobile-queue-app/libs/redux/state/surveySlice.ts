import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SurveyState {
  currentQuestionIndex: number;
  answers: Record<number, string | null>;
}

const initialState: SurveyState = {
  currentQuestionIndex: 0,
  answers: {},
};

const surveySlice = createSlice({
  name: "survey",
  initialState,
  reducers: {
    setAnswer: (
      state,
      action: PayloadAction<{ questionIndex: number; answer: string }>
    ) => {
      state.answers[action.payload.questionIndex] = action.payload.answer;
    },
    nextQuestion: (state) => {
      state.currentQuestionIndex += 1;
    },
    previousQuestion: (state) => {
      state.currentQuestionIndex -= 1;
    },
    resetSurvey: (state) => {
      state.currentQuestionIndex = 0;
      state.answers = {};
    },
  },
});

export const { setAnswer, nextQuestion, previousQuestion, resetSurvey } =
  surveySlice.actions;

export const surveyReducer = surveySlice.reducer;
