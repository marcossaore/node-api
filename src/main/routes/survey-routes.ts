import { Router } from 'express'
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey-controller-factory'
import { adaptRoute } from '../../main/adapters/express-router-adapter'

export default (router: Router): void => {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.post('/surveys', adaptRoute(makeAddSurveyController()))
}
