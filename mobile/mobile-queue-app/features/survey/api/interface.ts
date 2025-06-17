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

export interface SurveyQuestion {
  survey_index: number;
  survey_id: number;
  survey_type: number;
  survey_questions: string;
  no_of_choices: number;
  alpha_choices: {
    type: string;
    data: number[];
  };
  strType: string;
}

export type SurveyQuestions = SurveyQuestion[];

export interface SurveyAnswer {
  questionId: number;
  answer: string | null;
}

export type SurveyAnswers = Record<number, string | null>;

export interface SurveyResult {
  choice_index: string;
  survey_index: number;
  survey_id: number;
  survey_choice: string;
}

export interface SurveyQuestionDetailsResponse {
  next: {
    page: number;
    limit: number | null;
  };
  results: SurveyResult[];
}
