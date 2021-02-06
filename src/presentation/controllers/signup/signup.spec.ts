import { SignupController } from './signup'
import { MissingParamError, InvalidParamError, ServerError } from '../../errors'
import { AddAccount, AddAccountModel, AccountModel, EmailValidator } from './signup-protocols'
import { HttpRequest } from 'presentation/protocols'
import { ok, badRequest, serverError } from '../../helpers/http-helpers'
import { DocumentValidator } from '../../../domain/usecases/document-validator'
import { DocumentTypeValidator } from 'domain/usecases/document-type-validator'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    name: 'any_name',
    password: 'any_password',
    passwordConfirmation: 'any_password',
    typeDocument: 'any_type_document',
    document: 'any_document'
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

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeDocumentValidator = (): DocumentValidator => {
  class DocumentValidatorStub implements DocumentValidator {
    apply (document: string): boolean {
      return true
    }
  }

  return new DocumentValidatorStub()
}

const makeDocumentTypeValidator = (documentValidator: DocumentValidator): DocumentTypeValidator => {
  class DocumentTypeValidatorStub implements DocumentTypeValidator {
    hasValidation (tyoe: string): DocumentValidator {
      return documentValidator
    }
  }

  return new DocumentTypeValidatorStub()
}
interface SutType {
  sut: SignupController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
  documentValidatorStub: DocumentValidator
  documentTypeValidatorStub: DocumentTypeValidator
}

/**
  SUT: system under test
 */
const makeSut = (): SutType => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const documentValidatorStub = makeDocumentValidator()
  const documentTypeValidatorStub = makeDocumentTypeValidator(documentValidatorStub)
  const sut = new SignupController(emailValidatorStub, addAccountStub, documentTypeValidatorStub)

  return {
    sut,
    emailValidatorStub,
    addAccountStub,
    documentValidatorStub,
    documentTypeValidatorStub
  }
}

describe('Signup Controller', () => {
  test('should return 400 if no name is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
        typeDocument: 'any_type_document',
        document: 'any_document'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('name')))
  })

  test('should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password',
        typeDocument: 'any_type_document',
        document: 'any_document'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        name: 'any_name',
        passwordConfirmation: 'any_password',
        typeDocument: 'any_type_document',
        document: 'any_document'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  test('should return 400 if no password confirmation is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        name: 'any_name',
        password: 'any_password',
        typeDocument: 'any_type_document',
        document: 'any_document'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('passwordConfirmation')))
  })

  test('should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpRequest = {
      body: {
        email: 'invalid_email@mail.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password',
        typeDocument: 'any_type_document',
        document: 'any_document'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('should return 400 if password confirmation fails', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        name: 'any_name',
        password: 'password',
        passwordConfirmation: 'invalid_password',
        typeDocument: 'any_type_document',
        document: 'any_document'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('passwordConfirmation')))
  })

  test('should return 400 if no type document is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'invalid_password',
        document: 'any_document'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('typeDocument')))
  })

  test('should return 400 if no document is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'invalid_password',
        typeDocument: 'any_type'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('document')))
  })

  test('should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    await sut.handle(makeFakeRequest())
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
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

  test('should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })

  test('should call DocumentTypeValidator with correct document type', async () => {
    const { sut, documentTypeValidatorStub } = makeSut()
    const hasValidationSpy = jest.spyOn(documentTypeValidatorStub, 'hasValidation')
    await sut.handle(makeFakeRequest())
    expect(hasValidationSpy).toHaveBeenCalledWith('any_type_document')
  })

  test('should return null for a DocumentValidator when DocumentTypeValidator no has a validation to apply', async () => {
    const { sut, documentTypeValidatorStub } = makeSut()
    const hasValidationSpy = jest.spyOn(documentTypeValidatorStub, 'hasValidation').mockReturnValueOnce(null)
    await sut.handle(makeFakeRequest())
    expect(hasValidationSpy).toHaveReturnedWith(null)
  })

  test('should call DocumentValidator if DocumentTypeValidator returns a validation to apply', async () => {
    const { sut, documentValidatorStub } = makeSut()
    const applySpy = jest.spyOn(documentValidatorStub, 'apply')
    await sut.handle(makeFakeRequest())
    expect(applySpy).toHaveBeenCalledWith('any_document')
  })
})
