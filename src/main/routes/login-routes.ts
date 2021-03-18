import { Router } from 'express'
import { makeLoginController } from '@/main/factories/controllers/login/login-controller-factory'
import { adaptRoute } from '@/main/adapters/express-router-adapter'

export default (router: Router): void => {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.post('/login', adaptRoute(makeLoginController()))
}
