import { SignupController } from './signup'
import { ServerError } from '../../errors'
import { AddAccount, AddAccountModel, AccountModel } from './signup-protocols'
import { HttpRequest } from '../../protocols'
import { badRequest, conflict, ok, serverError } from '../../helpers/http/http-helpers'
import { Validation } from '../../protocols/validation'
import { VerifyExistedAccount } from '../../../data/protocols/db/verify-existed-account'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    name: 'any_name',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

const makeFakeAccount = (): any => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password'
})

const makeAddAccount = (): AddAccount => {
  class AddAcconutStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return Promise.resolve(makeFakeAccount())
    }
  }

  return new AddAcconutStub()
}

const makeValidation = (): Validation => {
  class ValidationStun implements Validation {
    validate (params: any): Error {
      return null
    }
  }

  return new ValidationStun()
}

const makeVerifyExistedAccount = (): VerifyExistedAccount => {
  class VerifyExistedAccountStub implements VerifyExistedAccount {
    async verify (email: string): Promise<boolean> {
      return false
    }
  }

  return new VerifyExistedAccountStub()
}
interface SutType {
  sut: SignupController
  validationStub: Validation
  addAccountStub: AddAccount
  verifyExistedAccountStub: VerifyExistedAccount
}

/**
  SUT: system under test
 */
const makeSut = (): SutType => {
  const validationStub = makeValidation()
  const addAccountStub = makeAddAccount()
  const verifyExistedAccountStub = makeVerifyExistedAccount()
  const sut = new SignupController(validationStub, addAccountStub, verifyExistedAccountStub)

  return {
    sut,
    validationStub,
    addAccountStub,
    verifyExistedAccountStub
  }
}

describe('Signup Controller', () => {
  test('should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(makeFakeRequest())
    const data = (makeFakeRequest().body)
    expect(validateSpy).toHaveBeenCalledWith(data)
  })

  test('should return a bad request with error provided from Validation fails', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockImplementationOnce(() => {
      return new Error('Validation Error')
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new Error('Validation Error')))
  })

  test('should throws when Validation throws', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockImplementationOnce(() => {
      throw new Error('Server Error')
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(Error('Server Error')))
  })

  test('should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    await sut.handle(makeFakeRequest())
    expect(addSpy).toHaveBeenCalledWith({
      email: 'any_email@mail.com',
      name: 'any_name',
      password: 'any_password'
    })
  })

  test('should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return Promise.reject(new Error())
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test('should call VerifyExistedAccount with correct email', async () => {
    const { sut, verifyExistedAccountStub } = makeSut()
    const SpyVerify = jest.spyOn(verifyExistedAccountStub, 'verify')
    await sut.handle(makeFakeRequest())
    expect(SpyVerify).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('should return an conflict if an email existed is provided', async () => {
    const { sut, verifyExistedAccountStub } = makeSut()
    jest.spyOn(verifyExistedAccountStub, 'verify').mockReturnValueOnce(Promise.resolve(true))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(conflict('account already exists!'))
  })

  test('should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })
})
