import { Validation } from 'presentation/validation/protocols/validation'
import { serverError } from '../../helpers/http-helpers'
import { Controller, HttpRequest, HttpResponse } from '../signup/signup-protocols'

export class LoginController implements Controller {
  private readonly validation: Validation

  constructor (validation: Validation) {
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      this.validation.validate(httpRequest.body)
    } catch (error) {
      return serverError(error)
    }
  }
}
