import { SaveSurveyResult, SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'
import { InvalidParamError, MissingParamError } from '@/presentation/errors'
import { badRequest, forbidden, ok, serverError } from '@/presentation/helpers/http/http-helpers'
import { Controller, HttpRequest, HttpResponse, LoadSurveyById } from './save-survey-result-controller-protocols'

export class SaveSurveyResultController implements Controller {
  private readonly loadSurveyById: LoadSurveyById
  private readonly saveSurveyResult: SaveSurveyResult

  constructor (loadSurveyById: LoadSurveyById, saveSurveyResult: SaveSurveyResult) {
    this.loadSurveyById = loadSurveyById
    this.saveSurveyResult = saveSurveyResult
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveyId = httpRequest.parameters.surveyId
      const answer = httpRequest.body?.answer

      if (!answer) {
        return badRequest(new MissingParamError('answer'))
      }

      const survey = await this.loadSurveyById.load(surveyId)

      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'))
      }

      const answers = survey.answers.map(item => item.answer)

      if (!answers.includes(httpRequest.body.answer)) {
        return forbidden(new InvalidParamError('answer'))
      }

      const accountId = httpRequest.data.accountId

      const surveyResult: SaveSurveyResultParams = await this.saveSurveyResult.save({
        surveyId,
        accountId,
        answer,
        date: new Date()
      })

      return ok(surveyResult)
    } catch (error) {
      return serverError(error)
    }
  }
}
