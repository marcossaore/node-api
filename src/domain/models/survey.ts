import { AddSurveyModel } from '../usecases/add-survey'

export interface SurveyModel extends AddSurveyModel {
  id: string
}
