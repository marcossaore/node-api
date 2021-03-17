import { Controller } from '../../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator-factory'
import { LoadSurveysController } from '../../../../../presentation/controllers/survey/load-survey/load-surveys-controller'
import { DbLoadSurvey } from '../../../../../data/usecases/load-survey/db-load-survey'
import { SurveyMongoRepository } from '../../../../../infra/db/mongodb/survey/survey-mongo-repository'

export const makeLoadSurveysController = (): Controller => {
  const loadSurveyRepository = new SurveyMongoRepository()
  const dbLoadSurvey = new DbLoadSurvey(loadSurveyRepository)
  const controller = new LoadSurveysController(dbLoadSurvey)
  return makeLogControllerDecorator(controller)
}
