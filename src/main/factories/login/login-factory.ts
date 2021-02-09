import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '../../../infra/criptography/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication'
import { LoginController } from '../../../presentation/controllers/login/login-controller'
import { Controller } from '../../../presentation/protocols'
import { makeLoginValidation } from './login-validation-factory'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import env from '../../config/env'

export const makeLoginController = (): Controller => {
  const salt = 12
  const accountMongoRepository = new AccountMongoRepository()
  const hashComparer = new BcryptAdapter(salt)
  const encrypter = new JwtAdapter(env.secret)
  const authentication = new DbAuthentication(accountMongoRepository, hashComparer, encrypter, accountMongoRepository)
  const logMongoRepository = new LogMongoRepository()
  const loginController = new LoginController(makeLoginValidation(), authentication)
  return new LogControllerDecorator(loginController, logMongoRepository)
}
