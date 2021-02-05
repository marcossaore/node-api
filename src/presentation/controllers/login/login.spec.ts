import { badRequest, serverError } from '../../helpers/http-helpers'
import { Validation } from '../../validation/protocols/validation'
import { HttpRequest } from '../signup/signup-protocols'
import { LoginController } from './login'

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (params: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

interface SutTypes {
  sut: LoginController
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const sut = new LoginController(validationStub)
  return {
    sut,
    validationStub
  }
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    password: 'any_password',
    email: 'any_email@gmail.com'
  }
})

describe('Login Controller', () => {
  test('should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(makeFakeRequest())
    expect(validateSpy).toHaveBeenCalledWith(makeFakeRequest().body)
  })

  test('should return a badRequest when the Validation fails', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockImplementationOnce(() => {
      return new Error('Validation Error')
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new Error('Validation Error')))
  })

  test('should throws when the Validation throws', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockImplementationOnce(() => {
      throw new Error('Validation Error')
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(Error('Validation Error')))
  })
})
