export interface Survey {
  survey_id: number;
  survey_name: string;
  survey_type: string | null;
  no_of_questions: number;
  random_questions: {
    type: string;
    data: number[];
  };
  survey_from: string;
  survey_to: string;
  surveyFrom: string;
  surveyTo: string;
}

export interface Pagination {
  page: number;
  limit: number | null;
}

export interface SurveyResponse {
  next: Pagination;
  results: Survey[];
}

export interface SurveyAnswer {
  questionId: number;
  answer: string | null;
}

export type SurveyAnswers = Record<number, string | null>;


// Survey Answer POST 

export interface SurveyAnswerPayload {
  respondent_ref: string;
  repondent_name: string;
  respondent_telno: string;
  respondent_address: string;
}

export interface SurveyAnswerPayloadResponse {
  ghError: number;
  ghMessage: string;
  answerId: number;
}
