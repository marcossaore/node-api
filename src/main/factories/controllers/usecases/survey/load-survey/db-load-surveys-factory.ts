import { DbLoadSurvey } from '@/data/usecases/load-survey/db-load-survey'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'

export const makeDbLoadSurveys = (): DbLoadSurvey => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadSurvey(surveyMongoRepository)
}
