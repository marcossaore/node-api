import { makeLoginValidation } from './login-validation'
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'
import { Validation } from '../../../presentation/controllers/login/login-protocols'
import { RequiredFieldValidation } from '../../../presentation/helpers/validators/required-field-validation'
import { EmailValidation } from '../../../presentation/helpers/validators/email-validation'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'
/**
 * Como o código está dentro do Main Layer e não está sendo feito injeção de dependência através do construtor
 * deve ser testado o módulo do ValidationComposite para mudar seu comportamento
 */
jest.mock('../../../presentation/helpers/validators/validation-composite')

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
