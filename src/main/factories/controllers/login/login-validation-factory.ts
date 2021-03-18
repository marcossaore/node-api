import { EmailValidatorAdapter } from '@/infra/validators/email-validator-adapter'
import { EmailValidation } from '@/validation/validators/email-validation'
import { RequiredFieldValidation } from '@/validation/validators/required-field-validation'
import { ValidationComposite } from '@/validation/validators/validation-composite'
import { Validation } from '@/presentation/protocols/validation'

export const makeLoginValidation = (): Validation => {
  const validations: Validation[] = []

  const requiredFields = ['email', 'password']

  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field))
  }

  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))

  return new ValidationComposite(validations)
}
