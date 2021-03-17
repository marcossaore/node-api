import { noContent, ok, serverError } from '../../../helpers/http/http-helpers'
import { Controller, HttpRequest, HttpResponse, LoadSurvey } from './load-survey-controller-protocols'

export class LoadSurveyController implements Controller {
  private readonly loadSurvey: LoadSurvey

  constructor (loadSurvey: LoadSurvey) {
    this.loadSurvey = loadSurvey
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurvey.load()
      return surveys ? ok(surveys) : noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
