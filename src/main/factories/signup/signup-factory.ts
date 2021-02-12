
import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account'
import { JwtAdapter } from '../../../infra/criptography/jwt-adapter/jwt-adapter'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository'
import { SignupController } from '../../../presentation/controllers/signup/signup-controller'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { makeSignupValidation } from './signup-validation-factory'
import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication'
import env from '../../config/env'

export const makeSignupController = (): Controller => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
  const validationComposite = makeSignupValidation()
  const hashComparer = new BcryptAdapter(salt)
  const encrypter = new JwtAdapter(env.secret)
  const authentication = new DbAuthentication(accountMongoRepository, hashComparer, encrypter, accountMongoRepository)
  const signupController = new SignupController(validationComposite, dbAddAccount, authentication)
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(signupController, logMongoRepository)
}
