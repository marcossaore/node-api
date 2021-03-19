import { SurveyResultModel } from '@/domain/models/survey-result'
import { SurveyResult } from '@/domain/usecases/save-survey-result'

export interface SaveSurveyResultRepository {
  save: (data: SurveyResult) => Promise<SurveyResultModel>
}
