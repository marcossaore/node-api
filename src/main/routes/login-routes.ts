import { Router } from 'express'
import { adaptRoute } from '../adapters/express-router-adapter'
import { makeLoginController } from '../factories/login/login-factory'

export default (router: Router): void => {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.post('/login', adaptRoute(makeLoginController()))
}
