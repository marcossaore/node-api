import { SurveyModel, LoadSurveysRepository } from './db-load-survey-protocols'
import { DbLoadSurvey } from './db-load-survey'
import MockDate from 'mockdate'

const makeFakeSurvey = (): SurveyModel => {
  return {
    id: 'any_id',
    question: 'any_question',
    answers: [
      {
        answer: 'any_answer'
      }
    ],
    date: new Date()
  }
}

const makeLoadSurveyRepository = (): LoadSurveysRepository => {
  class LoadSurveyRepositoryStub implements LoadSurveysRepository {
    async loadAll (): Promise<SurveyModel[]> {
      return [makeFakeSurvey()]
    }
  }
  return new LoadSurveyRepositoryStub()
}

type SutTypes = {
  sut: DbLoadSurvey
  loadSurveysRepositorystub: LoadSurveysRepository
}

const makeSut = (): SutTypes => {
  const loadSurveysRepositorystub = makeLoadSurveyRepository()
  const sut = new DbLoadSurvey(loadSurveysRepositorystub)
  return {
    sut,
    loadSurveysRepositorystub
  }
}

describe('DbLoadSurvey', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call LoadSurveysRepository correctly', async () => {
    const { sut, loadSurveysRepositorystub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveysRepositorystub, 'loadAll')
    await sut.load()
    expect(loadSpy).toHaveBeenCalled()
  })

  test('should return null if LoadSurveysRepository returns null', async () => {
    const { sut, loadSurveysRepositorystub } = makeSut()
    jest.spyOn(loadSurveysRepositorystub, 'loadAll').mockReturnValueOnce(null)
    const surveys = await sut.load()
    expect(surveys).toBeNull()
  })

  test('should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositorystub } = makeSut()
    jest.spyOn(loadSurveysRepositorystub, 'loadAll').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.load()
    await expect(promise).rejects.toThrow()
  })

  test('should return surveys on success', async () => {
    const { sut } = makeSut()
    const surveys = await sut.load()
    expect(surveys).toEqual([makeFakeSurvey()])
  })
})
