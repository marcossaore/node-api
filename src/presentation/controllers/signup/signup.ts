import { HttpRequest, HttpResponse, Controller, AddAccount } from './signup-protocols'
import { serverError, ok, badRequest } from '../../helpers/http/http-helpers'
import { Validation } from '../../protocols/validation'
import { VerifyExistedAccount } from '../../../data/protocols/db/verify-existed-account'

export class SignupController implements Controller {
  private readonly validation: Validation
  private readonly addAccount: AddAccount
  private readonly verifyExistedAccount: VerifyExistedAccount

  constructor (validation: Validation, addAccount: AddAccount, verifyExistedAccount: VerifyExistedAccount) {
    this.validation = validation
    this.addAccount = addAccount
    this.verifyExistedAccount = verifyExistedAccount
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)

      if (error) {
        return badRequest(error)
      }

      const { name, email, password } = httpRequest.body

      await this.verifyExistedAccount.verify(email)

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
