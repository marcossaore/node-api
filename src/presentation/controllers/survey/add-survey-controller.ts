import { Controller, HttpRequest, HttpResponse, Validation } from './add-survey-controller-protocols'
import { badRequest, serverError } from '../../helpers/http/http-helpers'
export class AddSurveyController implements Controller {
  private readonly validation: Validation
  constructor (validation: Validation) {
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      return null
    } catch (error) {
      return serverError(error)
    }
  }
}
