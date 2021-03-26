import { SurveyResultModel } from '../../models/survey-result'

export type SaveSurveyResultParams = {
  surveyId: string
  accountId: string
  answer: string
  date: Date
}

export interface SaveSurveyResult {
  save: (saveSurveyResultParams: SaveSurveyResultParams) => Promise<SurveyResultModel>
}