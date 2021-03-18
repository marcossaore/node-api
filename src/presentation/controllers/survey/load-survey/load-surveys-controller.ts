import { noContent, ok, serverError } from '@/presentation/helpers/http/http-helpers'
import { Controller, HttpRequest, HttpResponse, LoadSurveys } from './load-surveys-controller-protocols'

export class LoadSurveysController implements Controller {
  private readonly loadSurvey: LoadSurveys

  constructor (loadSurveys: LoadSurveys) {
    this.loadSurvey = loadSurveys
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
