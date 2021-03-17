import { noContent } from '../../../helpers/http/http-helpers'
import { Controller, HttpRequest, HttpResponse, LoadSurvey } from './load-survey-controller-protocols'

export class LoadSurveyController implements Controller {
  private readonly loadSurvey: LoadSurvey

  constructor (loadSurvey: LoadSurvey) {
    this.loadSurvey = loadSurvey
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const surveys = await this.loadSurvey.load()
    if (!surveys) {
      return noContent()
    }
    return null
  }
}
