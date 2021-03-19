import { SurveyResultModel } from '../models/survey-result'

export type SurveyVote = {
  questionId: string
  answer: string
}

export interface SaveSurveyResult {
  save: (surveyVote: SurveyVote) => Promise<SurveyResultModel>
}
