import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helpers'
import { Controller, HttpRequest, HttpResponse } from '../signup/signup-protocols'

export class LoginController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['email', 'password']

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
  }
}
