import { Router } from 'express'
import { makeAddSurveyController } from '../../main/factories/controllers/survey/add-survey/add-survey-controller-factory'
import { adaptRoute } from '../../main/adapters/express-router-adapter'
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware-factory'
import { adaptMiddleware } from '../adapters/express-middleware-adapter'

export default (router: Router): void => {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'))
  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()))
}
