import { makeLoginValidation } from './login-validation-factory'
import { EmailValidation , RequiredFieldValidation, ValidationComposite } from '../../../../validation/validators'
import { Validation } from '../../../../presentation/controllers/login/login-controller-protocols'
import { EmailValidatorAdapter } from '../../../../infra/validators/email-validator-adapter'

/**
 * Como o código está dentro do Main Layer e não está sendo feito injeção de dependência através do construtor
 * deve ser testado o módulo do ValidationComposite para mudar seu comportamento
 */
jest.mock('../../../../validation/validators/validation-composite')

describe('SignupValidation Factory', () => {
  test('should call ValidationComposite with all validations', () => {
    makeLoginValidation()

    const validations: Validation[] = []

    const requiredFields = ['email', 'password']
    for (const field of requiredFields) {
      validations.push(new RequiredFieldValidation(field))
    }

    validations.push(new EmailValidation('email', new EmailValidatorAdapter()))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
