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
