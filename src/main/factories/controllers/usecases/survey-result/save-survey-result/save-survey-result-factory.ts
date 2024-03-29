import { DbSaveSurveyResult } from '@/data/usecases/save-survey-result/db-save-survey-result'
import { SurveyResultMongoRepository } from '@/infra/db/mongodb/survey-result/survey-result-mongo-repository'

export const makeDbSaveSurveyResult = (): DbSaveSurveyResult => {
  const saveSurveyResultMongoRepository = new SurveyResultMongoRepository()
  return new DbSaveSurveyResult(saveSurveyResultMongoRepository)
}
