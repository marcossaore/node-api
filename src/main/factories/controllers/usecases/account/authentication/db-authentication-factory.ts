import { Authentication } from '@/domain/usecases/account/authetication'
import { DbAuthentication } from '@/data/usecases/authentication/db-authentication'
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '@/infra/criptography/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'
import env from '@/main/config/env'

export const makeDbAuthentication = (): Authentication => {
  const salt = 12
  const accountMongoRepository = new AccountMongoRepository()
  const hashComparer = new BcryptAdapter(salt)
  const encrypter = new JwtAdapter(env.secret)
  return new DbAuthentication(accountMongoRepository, hashComparer, encrypter, accountMongoRepository)
}
