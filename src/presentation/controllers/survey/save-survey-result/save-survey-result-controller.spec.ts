import { HttpRequest, LoadSurveyById, SaveSurveyResult, SurveyVote, SurveyResultModel } from './save-survey-result-controller-protocols'
import { SaveSurveyResultController } from './save-survey-result-controller'
import { badRequest, forbidden, ok, serverError } from '@/presentation/helpers/http/http-helpers'
import { InvalidParamError, MissingParamError } from '@/presentation/errors'
import { SurveyModel } from '@/domain/models/survey'
import MockDate from 'mockdate'

const makeFakeRequest = (): HttpRequest => ({
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

const makeFakeSurveyModel = (): SurveyModel => ({
  id: 'survey_id',
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

const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async load (id: string): Promise<SurveyModel> {
      return makeFakeSurveyModel()
    }
  }

  return new LoadSurveyByIdStub()
}

const makeSurveyResultModel = (): SurveyResultModel => ({
  id: 'survey_result_id',
  accountId: 'account_id',
  answer: 'any_answer',
  surveyId: 'survey_id',
  date: new Date()
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
  loadSurveyByIdStub: LoadSurveyById
  saveSurveyResultStub: SaveSurveyResult
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = makeLoadSurveyById()
  const saveSurveyResultStub = makeSaveResultSurvey()
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
    await sut.handle(makeFakeRequest())
    expect(spyLoad).toHaveBeenCalledWith('survey_id')
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
      surveyId: 'survey_id',
      accountId: 'account_id',
      answer: 'any_answer',
      date: new Date()
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
