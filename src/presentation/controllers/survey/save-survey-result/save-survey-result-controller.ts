import { AccessDeniedError } from '@/presentation/errors'
import { badRequest, forbidden, serverError } from '@/presentation/helpers/http/http-helpers'
import { Validation } from '@/presentation/protocols'
import { Controller, HttpRequest, HttpResponse, LoadSurveyById } from './save-survey-result-controller-protocols'

export class SaveSurveyResult implements Controller {
  private readonly loadSurveyById: LoadSurveyById
  private readonly validation: Validation
  constructor (validation: Validation, loadSurveyById: LoadSurveyById) {
    this.loadSurveyById = loadSurveyById
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveyId = httpRequest.parameters?.surveyId
      const error = this.validation.validate(httpRequest.body)

      if (error) {
        return badRequest(error)
      }

      const survey = await this.loadSurveyById.load(surveyId)
      if (!survey) {
        return forbidden(new AccessDeniedError())
      }
    } catch (error) {
      return serverError(error)
    }
  }
}
