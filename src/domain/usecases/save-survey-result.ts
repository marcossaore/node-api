import { SurveyResultModel } from '../models/survey-result'

export interface SurveyResult {
  questionId: string
  answer: string
}

export interface SaveSurveyResult {
  save: (surveyResult: SurveyResult) => Promise<SurveyResultModel>
}
