import { makeSurveyResultController } from '@/main/factories/controllers/survey-result/save-survey-result-controller-factory'
import { adaptRoute } from '@/main/adapters/express-router-adapter'
import { auth } from '@/main/middlewares/auth'
import { Router } from 'express'

export default (router: Router): void => {
  router.put('/surveys/:surveyId/results', auth, adaptRoute(makeSurveyResultController()))
}
