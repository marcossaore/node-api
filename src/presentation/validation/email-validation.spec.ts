import { EmailValidator } from '../protocols/email-validator'
import { EmailValidation } from './email-validation'

describe('Email Validation', () => {
  test('should call EmailValidator with correct email', () => {
    class EmailValidatorStub implements EmailValidator {
      isValid (email: string): boolean {
        return true
      }
    }
    const emailValidatorStub = new EmailValidatorStub()
    const sut = new EmailValidation('email', emailValidatorStub)
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const data = {
      email: 'any_email@email.com'
    }
    sut.validate(data)
    expect(isValidSpy).toHaveBeenLastCalledWith('any_email@email.com')
  })
})
