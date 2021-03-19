import { SurveyResultModel } from '@/domain/models/survey-result'
import { SurveyVote } from '@/domain/usecases/save-survey-result'

export interface SaveSurveyResultRepository {
  save: (SurveyVote: SurveyVote) => Promise<SurveyResultModel>
}
