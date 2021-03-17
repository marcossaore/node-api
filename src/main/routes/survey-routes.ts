import { Router } from 'express'
import { makeAddSurveyController } from '../../main/factories/controllers/survey/add-survey/add-survey-controller-factory'
import { adaptRoute } from '../../main/adapters/express-router-adapter'
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware-factory'
import { adaptMiddleware } from '../adapters/express-middleware-adapter'
import { makeLoadSurveyController } from '../../main/factories/controllers/survey/load-survey/load-survey-controller-factory'

export default (router: Router): void => {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'))
  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()))

  const userAuth = adaptMiddleware(makeAuthMiddleware())
  router.get('/surveys', userAuth, adaptRoute(makeLoadSurveyController()))
}
