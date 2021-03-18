import { DbLoadSurvey } from '@/data/usecases/load-survey/db-load-survey'
import { Controller } from '@/presentation/protocols'
import { LoadSurveysController } from '@/presentation/controllers/survey/load-survey/load-surveys-controller'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'

export const makeLoadSurveysController = (): Controller => {
  const loadSurveyRepository = new SurveyMongoRepository()
  const dbLoadSurvey = new DbLoadSurvey(loadSurveyRepository)
  const controller = new LoadSurveysController(dbLoadSurvey)
  return makeLogControllerDecorator(controller)
}
