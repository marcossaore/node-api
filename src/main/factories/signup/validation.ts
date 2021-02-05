import { CompareFieldValidation } from '../../../presentation/validation/compare-field-validation'
import { EmailValidation } from '../../../presentation/validation/email-validation'
import { RequiredFieldValidation } from '../../../presentation/validation/required-field-validation'
import { ValidationComposite } from '../../../presentation/validation/validation-composite'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'
import { Validation } from '../../../presentation/validation/protocols/validation'

export const makeValidation = (): Validation => {
  const validations: Validation[] = []

  const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field))
  }

  validations.push(new CompareFieldValidation('password', 'passwordConfirmation'))

  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))

  return new ValidationComposite(validations)
}
