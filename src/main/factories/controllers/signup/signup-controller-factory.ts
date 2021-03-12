import { SignupController } from '../../../../presentation/controllers/signup/signup-controller'
import { Controller } from '../../../../presentation/protocols'
import { makeSignupValidation } from './signup-validation-factory'
import { makeDbAccount } from '../usecases/account/add-account/db-add-account-factory'
import { makeDbAuthentication } from '../usecases/account/authentication/db-authentication-factory'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'

export const makeSignupController = (): Controller => {
  const validationComposite = makeSignupValidation()
  const controller = new SignupController(validationComposite, makeDbAccount(), makeDbAuthentication())
  return makeLogControllerDecorator(controller)
}
