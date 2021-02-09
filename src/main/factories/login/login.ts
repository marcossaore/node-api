import { UpdateAccessTokenRepository } from 'data/protocols/db/update-access-token-repository'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '../../../infra/criptography/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account-repository/account'
import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication'
import { LoginController } from '../../../presentation/controllers/login/login'
import { Controller } from '../../../presentation/protocols'
import { makeLoginValidation } from './login-validation'

export const makeLoginController = (): Controller => {
  const salt = 12
  const secret = 'secret'
  const accountMongoRepository = new AccountMongoRepository()
  const hashComparer = new BcryptAdapter(salt)
  const encrypter = new JwtAdapter(secret)
  const updateAccessTokenRepository: UpdateAccessTokenRepository = null
  const authentication = new DbAuthentication(accountMongoRepository, hashComparer, encrypter, updateAccessTokenRepository)
  return new LoginController(makeLoginValidation(), authentication)
}
