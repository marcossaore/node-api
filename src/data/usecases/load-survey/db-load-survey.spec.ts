import { SurveyModel, LoadSurveyRepository } from './db-load-survey-protocols'
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

const makeLoadSurveyRepository = (): LoadSurveyRepository => {
  class LoadSurveyRepositoryStub implements LoadSurveyRepository {
    async loadAll (): Promise<SurveyModel[]> {
      return [makeFakeSurvey()]
    }
  }
  return new LoadSurveyRepositoryStub()
}

type SutTypes = {
  sut: DbLoadSurvey
  loadSurveyRepositorystub: LoadSurveyRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyRepositorystub = makeLoadSurveyRepository()
  const sut = new DbLoadSurvey(loadSurveyRepositorystub)
  return {
    sut,
    loadSurveyRepositorystub
  }
}

describe('DbLoadSurvey', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call LoadSurveyRepository correctly', async () => {
    const { sut, loadSurveyRepositorystub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyRepositorystub, 'loadAll')
    await sut.load()
    expect(loadSpy).toHaveBeenCalled()
  })

  test('should return null if LoadSurveyRepository returns null', async () => {
    const { sut, loadSurveyRepositorystub } = makeSut()
    jest.spyOn(loadSurveyRepositorystub, 'loadAll').mockReturnValueOnce(null)
    const surveys = await sut.load()
    expect(surveys).toBeNull()
  })

  test('should throw if LoadSurveyRepository throws', async () => {
    const { sut, loadSurveyRepositorystub } = makeSut()
    jest.spyOn(loadSurveyRepositorystub, 'loadAll').mockImplementationOnce(() => {
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
