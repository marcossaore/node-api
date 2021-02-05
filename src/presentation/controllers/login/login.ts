import { Validation } from 'presentation/validation/protocols/validation'
import { badRequest, serverError, unauthorized } from '../../helpers/http-helpers'
import { Controller, HttpRequest, HttpResponse } from '../signup/signup-protocols'
import { Authentication } from '../../../domain/usecases/authetication'

export class LoginController implements Controller {
  private readonly validation: Validation
  private readonly authentication: Authentication

  constructor (validation: Validation, authentication: Authentication) {
    this.validation = validation
    this.authentication = authentication
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)

      if (error) {
        return badRequest(error)
      }

      const { email, password } = httpRequest.body

      const accessToken = await this.authentication.auth(email, password)

      if (!accessToken) {
        return unauthorized()
      }
    } catch (error) {
      return serverError(error)
    }
  }
}
