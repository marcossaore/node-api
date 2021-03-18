import { HttpRequest, HttpResponse, Controller, AddAccount, Authentication } from './signup-controller-protocols'
import { serverError, ok, badRequest, forbidden } from '@/presentation/helpers/http/http-helpers'
import { Validation } from '@/presentation/protocols/validation'
import { EmailInUseError } from '@/presentation/errors'

export class SignupController implements Controller {
  private readonly validation: Validation
  private readonly addAccount: AddAccount
  private readonly authentication: Authentication

  constructor (validation: Validation, addAccount: AddAccount, authentication: Authentication) {
    this.validation = validation
    this.addAccount = addAccount
    this.authentication = authentication
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)

      if (error) {
        return badRequest(error)
      }

      const { name, email, password } = httpRequest.body

      const accountCreated = await this.addAccount.add({
        name,
        email,
        password
      })

      if (!accountCreated) {
        return forbidden(new EmailInUseError())
      }

      const accessToken = await this.authentication.auth({
        email,
        password
      })

      return ok({ accessToken })
    } catch (error) {
      console.error(error)
      return serverError(error)
    }
  }
}
