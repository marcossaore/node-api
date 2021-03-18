import { HttpRequest, LoadSurveyById } from './save-survey-result-controller-protocols'
import { SaveSurveyResult } from './save-survey-result-controller'
import { badRequest, forbidden, serverError } from '@/presentation/helpers/http/http-helpers'
import { AccessDeniedError, MissingParamError } from '@/presentation/errors'
import { SurveyModel } from '@/domain/models/survey'
import MockDate from 'mockdate'

const makeFakeRequest = (): HttpRequest => ({
  parameters: {
    surveyId: 'any_id'
  }
})

const makeFakeSurveyModel = (): SurveyModel => ({
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
})

const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async load (id: string): Promise<SurveyModel> {
      return makeFakeSurveyModel()
    }
  }

  return new LoadSurveyByIdStub()
}

type SutTypes = {
  sut: SaveSurveyResult
  loadSurveyByIdStub: LoadSurveyById
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = makeLoadSurveyById()
  const sut = new SaveSurveyResult(loadSurveyByIdStub)
  return {
    sut,
    loadSurveyByIdStub
  }
}

describe('SaveSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should return 400 if surveyId is no provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(badRequest(new MissingParamError('surveyId')))
  })

  test('should call LoadSurveyById with correct surveyId', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const spyLoad = jest.spyOn(loadSurveyByIdStub, 'load')
    await sut.handle(makeFakeRequest())
    expect(spyLoad).toHaveBeenCalledWith('any_id')
  })

  test('should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'load').mockReturnValueOnce(null)
    const hhtpResponse = await sut.handle(makeFakeRequest())
    expect(hhtpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'load').mockImplementationOnce(() => {
      throw new Error()
    })
    const hhtpResponse = await sut.handle(makeFakeRequest())
    expect(hhtpResponse).toEqual(serverError(new Error()))
  })
})
