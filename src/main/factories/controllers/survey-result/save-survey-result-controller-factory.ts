import { SaveSurveyResultController } from '@/presentation/controllers/survey/save-survey-result/save-survey-result-controller'
import { Controller } from '@/presentation/protocols'
import { makeDbLoadSurveyById } from '../usecases/survey/load-survey-by-id/db-load-survey-by-id-factory'
import { makeDbSaveSurveyResult } from '../usecases/survey-result/save-survey-result/save-survey-result-factory'

export const makeSurveyResultController = (): Controller => {
  return new SaveSurveyResultController(makeDbLoadSurveyById(), makeDbSaveSurveyResult())
}
