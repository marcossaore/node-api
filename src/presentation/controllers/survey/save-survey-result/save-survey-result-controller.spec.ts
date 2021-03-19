import { HttpRequest, LoadSurveyById, SaveSurveyResult, SurveyVote, SurveyResultModel } from './save-survey-result-controller-protocols'
import { SaveSurveyResultController } from './save-survey-result-controller'
import { badRequest, forbidden, ok, serverError } from '@/presentation/helpers/http/http-helpers'
import { InvalidParamError, MissingParamError } from '@/presentation/errors'
import { SurveyModel } from '@/domain/models/survey'
import MockDate from 'mockdate'
import { Validation } from '@/presentation/protocols'

const makeFakeRequest = (): HttpRequest => ({
  parameters: {
    surveyId: 'any_survey_id'
  },
  body: {
    answer: 'any_answer'
  }
})

const makeFakeSurveyModel = (): SurveyModel => ({
  id: 'any_survey_id',
  question: 'any_question',
  answers: [
    {
      answer: 'other_answer'
    },
    {
      answer: 'any_answer'
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

const makeSurveyResultModel = (): SurveyResultModel => ({
  id: 'any_survey_result_id',
  questionId: 'any_question',
  answers: [
    {
      answer: 'other_answer',
      votes: 124
    },
    {
      answer: 'any_answer',
      votes: 45
    }
  ]
})

const makeSaveResultSurvey = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save (surveyVote: SurveyVote): Promise<SurveyResultModel> {
      return makeSurveyResultModel()
    }
  }
  return new SaveSurveyResultStub()
}

type SutTypes = {
  sut: SaveSurveyResultController
  validationStub: Validation
  loadSurveyByIdStub: LoadSurveyById
  saveSurveyResultStub: SaveSurveyResult
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const loadSurveyByIdStub = makeLoadSurveyById()
  const saveSurveyResultStub = makeSaveResultSurvey()
  const sut = new SaveSurveyResultController(validationStub, loadSurveyByIdStub, saveSurveyResultStub)
  return {
    sut,
    validationStub,
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
    expect(spyLoad).toHaveBeenCalledWith('any_survey_id')
  })

  test('should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'load').mockReturnValueOnce(null)
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'load').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeFakeRequest())
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
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
  })

  test('should call SaveSurveyUseCase with correct values', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save')
    await sut.handle(makeFakeRequest())
    const surveyResult: SurveyVote = {
      questionId: 'any_survey_id',
      answer: 'any_answer'
    }
    expect(saveSpy).toHaveBeenCalledWith(surveyResult)
  })

  test('should return 500 if SaveSurveyUseCase throws', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    jest.spyOn(saveSurveyResultStub, 'save').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(makeSurveyResultModel()))
  })
})
