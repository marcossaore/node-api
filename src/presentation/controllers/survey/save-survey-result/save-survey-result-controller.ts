import { MissingParamError } from '@/presentation/errors'
import { badRequest } from '@/presentation/helpers/http/http-helpers'
import { Controller, HttpRequest, HttpResponse } from './save-survey-result-controller-protocols'

export class SaveSurveyResult implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.parameters?.surveyId) {
      return badRequest(new MissingParamError('surveyId'))
    }
  }
}
