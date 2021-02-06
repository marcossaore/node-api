import { HttpRequest, HttpResponse, Controller, EmailValidator, AddAccount } from './signup-protocols'
import { MissingParamError, InvalidParamError } from '../../errors'
import { badRequest, serverError, ok } from '../../helpers/http-helpers'
import { DocumentTypeValidator } from '../../../domain/usecases/document-type-validator'
export class SignupController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount
  private readonly documentTypeValidator: DocumentTypeValidator

  constructor (emaiValidator: EmailValidator, addAccount: AddAccount, documentTypeValidator: DocumentTypeValidator) {
    this.emailValidator = emaiValidator
    this.addAccount = addAccount
    this.documentTypeValidator = documentTypeValidator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation', 'typeDocument', 'document']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { name, email, password, passwordConfirmation, typeDocument, document } = httpRequest.body

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const isValid = this.emailValidator.isValid(email)

      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }

      const validation = this.documentTypeValidator.hasValidation(typeDocument)

      if (validation) {
        validation.validate(document)
      }

      const account = await this.addAccount.add({
        name,
        email,
        password
      })

      return ok(account)
    } catch (error) {
      console.error(error)
      return serverError(error)
    }
  }
}
