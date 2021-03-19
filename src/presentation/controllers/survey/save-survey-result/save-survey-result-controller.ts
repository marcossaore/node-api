import { SaveSurveyResult } from '@/domain/usecases/save-survey-result'
import { InvalidParamError } from '@/presentation/errors'
import { badRequest, forbidden, serverError } from '@/presentation/helpers/http/http-helpers'
import { Validation } from '@/presentation/protocols'
import { Controller, HttpRequest, HttpResponse, LoadSurveyById } from './save-survey-result-controller-protocols'

export class SaveSurveyResultController implements Controller {
  private readonly loadSurveyById: LoadSurveyById
  private readonly validation: Validation
  private readonly saveSurveyResult: SaveSurveyResult

  constructor (validation: Validation, loadSurveyById: LoadSurveyById, saveSurveyResult: SaveSurveyResult) {
    this.loadSurveyById = loadSurveyById
    this.validation = validation
    this.saveSurveyResult = saveSurveyResult
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
        return forbidden(new InvalidParamError('surveyId'))
      }

      const answer = survey.answers.filter(answer => answer.answer === httpRequest.body.answer)

      if (answer.length === 0) {
        return forbidden(new InvalidParamError('answer'))
      }

      await this.saveSurveyResult.save({
        questionId: survey.id,
        answer: httpRequest.body.answer
      })
    } catch (error) {
      return serverError(error)
    }
  }
}
