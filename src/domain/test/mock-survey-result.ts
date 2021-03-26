import { SaveSurveyResultParams, SurveyResultModel } from '@/data/usecases/save-survey-result/db-save-survey-result-protocols'

export const mockSaveSurveyResultParams = (): SaveSurveyResultParams => ({
  surveyId: 'survey_id',
  accountId: 'account_id',
  answer: 'any_answer',
  date: new Date()
})

export const mockSurveyResultModel = (): SurveyResultModel => ({
  id: 'any_id',
  surveyId: 'survey_id',
  accountId: 'account_id',
  answer: 'any_answer',
  date: new Date()
})
