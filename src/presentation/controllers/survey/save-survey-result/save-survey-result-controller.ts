import { AccessDeniedError, MissingParamError } from '@/presentation/errors'
import { badRequest, forbidden } from '@/presentation/helpers/http/http-helpers'
import { Controller, HttpRequest, HttpResponse, LoadSurveyById } from './save-survey-result-controller-protocols'

export class SaveSurveyResult implements Controller {
  private readonly loadSurveyById: LoadSurveyById
  constructor (loadSurveyById: LoadSurveyById) {
    this.loadSurveyById = loadSurveyById
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const surveyId = httpRequest.parameters?.surveyId
    if (!surveyId) {
      return badRequest(new MissingParamError('surveyId'))
    }
    const survey = await this.loadSurveyById.load(surveyId)
    if (!survey) {
      return forbidden(new AccessDeniedError())
    }
  }
}
