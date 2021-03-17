import { Router } from 'express'
import { makeAddSurveyController } from '../../main/factories/controllers/survey/add-survey/add-survey-controller-factory'
import { adaptRoute } from '../../main/adapters/express-router-adapter'
import { makeLoadSurveysController } from '../factories/controllers/survey/load-survey/load-surveys-controller-factory'
import { adminAuth } from '../middlewares/auth-admin'
import { auth } from '../middlewares/auth'

export default (router: Router): void => {
  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()))
  router.get('/surveys', auth, adaptRoute(makeLoadSurveysController()))
}
