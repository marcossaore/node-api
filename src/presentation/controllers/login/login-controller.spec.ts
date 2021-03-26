import { HttpRequest, Authentication, Validation } from './login-controller-protocols'
import { badRequest, ok, serverError, unauthorized } from '@/presentation/helpers/http/http-helpers'
import { throwError } from '@/domain/test'
import { LoginController } from './login-controller'
import { mockValidation } from '@/validation/test'
import { mockAuthentication } from '@/presentation/test'

type SutTypes = {
  sut: LoginController
  validationStub: Validation
  authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
  const validationStub = mockValidation()
  const authenticationStub = mockAuthentication()
  const sut = new LoginController(validationStub, authenticationStub)
  return {
    sut,
    validationStub,
    authenticationStub
  }
}

const mockRequest = (): HttpRequest => ({
  body: {
    password: 'any_password',
    email: 'any_email@gmail.com'
  }
})

describe('Login Controller', () => {
  test('should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(mockRequest())
    expect(validateSpy).toHaveBeenCalledWith(mockRequest().body)
  })

  test('should return a badRequest when the Validation fails', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockImplementationOnce(() => {
      return new Error('Validation Error')
    })
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(new Error('Validation Error')))
  })

  test('should throws when the Validation throws', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockImplementationOnce(() => {
      throw new Error('Validation Error')
    })
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(Error('Validation Error')))
  })

  test('should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    await sut.handle(mockRequest())
    expect(authSpy).toHaveBeenCalledWith({
      email: 'any_email@gmail.com',
      password: 'any_password'
    })
  })

  test('should return unauthorized if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(null)
    const httpResponde = await sut.handle(mockRequest())
    expect(httpResponde).toEqual(unauthorized())
  })

  test('should throws when the Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut()
    const httpResponde = await sut.handle(mockRequest())
    expect(httpResponde).toEqual(ok({ accessToken: 'any_token' }))
  })
})
