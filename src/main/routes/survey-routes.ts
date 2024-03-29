import { makeAddSurveyController } from '@/main/factories/controllers/survey/add-survey/add-survey-controller-factory'
import { adaptRoute } from '@/main/adapters/express-router-adapter'
import { makeLoadSurveysController } from '@/main/factories/controllers/survey/load-survey/load-surveys-controller-factory'
import { adminAuth } from '@/main/middlewares/auth-admin'
import { auth } from '@/main/middlewares/auth'
import { Router } from 'express'

export default (router: Router): void => {
  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()))
  router.get('/surveys', auth, adaptRoute(makeLoadSurveysController()))
}
