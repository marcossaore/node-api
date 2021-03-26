import { HttpRequest, LoadSurveyById, SaveSurveyResult, SaveSurveyResultParams } from './save-survey-result-controller-protocols'
import { SaveSurveyResultController } from './save-survey-result-controller'
import { mockSurveyResultModel, throwError } from '@/domain/test'
import { badRequest, forbidden, ok, serverError } from '@/presentation/helpers/http/http-helpers'
import { InvalidParamError, MissingParamError } from '@/presentation/errors'
import MockDate from 'mockdate'
import { mockLoadSurveyById, mockSaveResultSurvey } from '@/presentation/test'

const mockRequest = (): HttpRequest => ({
  data: {
    accountId: 'account_id'
  },
  parameters: {
    surveyId: 'survey_id'
  },
  body: {
    answer: 'any_answer'
  }
})

type SutTypes = {
  sut: SaveSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
  saveSurveyResultStub: SaveSurveyResult
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = mockLoadSurveyById()
  const saveSurveyResultStub = mockSaveResultSurvey()
  const sut = new SaveSurveyResultController(loadSurveyByIdStub, saveSurveyResultStub)
  return {
    sut,
    loadSurveyByIdStub,
    saveSurveyResultStub
  }
}

describe('SaveSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should return 400 if answer is no provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({
      parameters: {
        surveyId: 'any_survey_id'
      }
    })
    expect(httpResponse).toEqual(badRequest(new MissingParamError('answer')))
  })

  test('should call LoadSurveyById with correct surveyId', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const spyLoad = jest.spyOn(loadSurveyByIdStub, 'load')
    await sut.handle(mockRequest())
    expect(spyLoad).toHaveBeenCalledWith('survey_id')
  })

  test('should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'load').mockReturnValueOnce(null)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'load').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should return 403 if answer is invalid', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'load').mockReturnValueOnce(Promise.resolve({
      id: 'any_id',
      question: 'any_question',
      answers: [
        {
          answer: 'first_answer'
        },
        {
          answer: 'second_answer'
        }
      ],
      date: new Date()
    }))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
  })

  test('should call SaveSurveyUseCase with correct values', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save')
    await sut.handle(mockRequest())
    const surveyResult: SaveSurveyResultParams = {
      surveyId: 'survey_id',
      accountId: 'account_id',
      answer: 'any_answer',
      date: new Date()
    }
    expect(saveSpy).toHaveBeenCalledWith(surveyResult)
  })

  test('should return 500 if SaveSurveyUseCase throws', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    jest.spyOn(saveSurveyResultStub, 'save').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(mockSurveyResultModel()))
  })
})
