import { SurveyResultModel } from '../models/survey-result'

export type SurveyVote = {
  surveyId: string
  accountId: string
  answer: string
  date: Date
}

export interface SaveSurveyResult {
  save: (surveyVote: SurveyVote) => Promise<SurveyResultModel>
}
