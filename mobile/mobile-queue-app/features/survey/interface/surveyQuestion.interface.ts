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
