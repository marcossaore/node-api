import { SurveyModel } from '@/domain/models/survey'

export type SurveyAnswer = {
  image?: string
  answer: string
}

export type AddSurveyParams = Omit<SurveyModel, 'id'>

export interface AddSurvey {
  add: (data: AddSurveyParams) => Promise<void>
}
