import { InvalidParamError } from '../errors'
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

  test('should return a InvalidParamError when an invalid email is provided', () => {
    class EmailValidatorStub implements EmailValidator {
      isValid (email: string): boolean {
        return true
      }
    }
    const emailValidatorStub = new EmailValidatorStub()
    const sut = new EmailValidation('email', emailValidatorStub)
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const data = {
      email: 'invalid@email.com'
    }
    const error = sut.validate(data)
    expect(error).toEqual(new InvalidParamError('email'))
  })

  test('should not return when provided email to be correct', () => {
    class EmailValidatorStub implements EmailValidator {
      isValid (email: string): boolean {
        return true
      }
    }
    const emailValidatorStub = new EmailValidatorStub()
    const sut = new EmailValidation('email', emailValidatorStub)
    const data = {
      email: 'valid@email.com'
    }
    const error = sut.validate(data)
    expect(error).toBeFalsy()
  })
})
