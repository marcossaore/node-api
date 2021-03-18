import {} from './save-survey-result-controller-protocols'
import { SaveSurveyResult } from './save-survey-result-controller'
import { badRequest } from '@/presentation/helpers/http/http-helpers'
import { MissingParamError } from '@/presentation/errors'

type SutTypes = {
  sut: SaveSurveyResult
}

const makeSut = (): SutTypes => {
  const sut = new SaveSurveyResult()
  return {
    sut
  }
}

describe('SaveSurveyResult Controller', () => {
  test('should return 400 if surveyId is no provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(badRequest(new MissingParamError('surveyId')))
  })
})
