import { HttpRequest, LoadSurveyById } from './save-survey-result-controller-protocols'
import { SaveSurveyResult } from './save-survey-result-controller'
import { badRequest, forbidden, serverError } from '@/presentation/helpers/http/http-helpers'
import { AccessDeniedError, MissingParamError } from '@/presentation/errors'
import { SurveyModel } from '@/domain/models/survey'
import MockDate from 'mockdate'
import { Validation } from '@/presentation/protocols'

const makeFakeRequest = (): HttpRequest => ({
  parameters: {
    surveyId: 'any_id'
  },
  body: {
    answer: 'any_answer'
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

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (params): any {
      return null
    }
  }

  return new ValidationStub()
}

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
  validationStub: Validation
  loadSurveyByIdStub: LoadSurveyById
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const loadSurveyByIdStub = makeLoadSurveyById()
  const sut = new SaveSurveyResult(validationStub, loadSurveyByIdStub)
  return {
    sut,
    validationStub,
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

  test('should call Validation with correct answer', async () => {
    const { sut, validationStub } = makeSut()
    const validate = jest.spyOn(validationStub, 'validate')
    const fakeRequest = makeFakeRequest()
    await sut.handle(fakeRequest)
    const validData = {
      answer: fakeRequest.body.answer
    }
    expect(validate).toHaveBeenCalledWith(validData)
  })

  test('should return 400 if Validation fails', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })

  test('should return 500 if Validation throws', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
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
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'load').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
