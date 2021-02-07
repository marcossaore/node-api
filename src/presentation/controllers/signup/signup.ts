import { HttpRequest, HttpResponse, Controller, AddAccount } from './signup-protocols'
import { serverError, ok, badRequest } from '../../helpers/http/http-helpers'
import { Validation } from '../../helpers/validators/protocols/validation'

export class SignupController implements Controller {
  private readonly validation: Validation
  private readonly addAccount: AddAccount

  constructor (validation: Validation, addAccount: AddAccount) {
    this.validation = validation
    this.addAccount = addAccount
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)

      if (error) {
        return badRequest(error)
      }

      const { name, email, password } = httpRequest.body

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
