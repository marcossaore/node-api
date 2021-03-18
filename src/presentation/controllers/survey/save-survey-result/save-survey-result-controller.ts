import { MissingParamError } from '@/presentation/errors'
import { badRequest } from '@/presentation/helpers/http/http-helpers'
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
    await this.loadSurveyById.load(surveyId)
  }
}
