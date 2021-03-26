import { throwError } from '@/domain/test'
import { InvalidParamError } from '@/presentation/errors'
import { EmailValidator } from '../protocols/email-validator'
import { mockEmailValidator } from '../test'
import { EmailValidation } from './email-validation'

type SutTypes = {
  sut: EmailValidation
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = mockEmailValidator()
  const sut = new EmailValidation('email', emailValidatorStub)

  return {
    sut,
    emailValidatorStub
  }
}

const makeFakeData = (): any => ({
  email: 'any_email@email.com'
})

describe('Email Validation', () => {
  test('should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    sut.validate(makeFakeData())
    expect(isValidSpy).toHaveBeenLastCalledWith('any_email@email.com')
  })

  test('should return a InvalidParamError when an invalid email is provided', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const error = sut.validate(makeFakeData())
    expect(error).toEqual(new InvalidParamError('email'))
  })

  test('should throw if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(throwError)
    expect(sut.validate).toThrow()
  })

  test('should not return when provided email to be correct', () => {
    const { sut } = makeSut()
    const error = sut.validate(makeFakeData())
    expect(error).toBeFalsy()
  })
})
