import { DbLoadSurvey } from './db-load-survey'
import MockDate from 'mockdate'
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository'
import { mockLoadSurveyRepository } from '@/data/test'
import { mockSurveyModel, throwError } from '@/domain/test'

type SutTypes = {
  sut: DbLoadSurvey
  loadSurveysRepositorystub: LoadSurveysRepository
}

const makeSut = (): SutTypes => {
  const loadSurveysRepositorystub = mockLoadSurveyRepository()
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
    jest.spyOn(loadSurveysRepositorystub, 'loadAll').mockImplementationOnce(throwError)
    const promise = sut.load()
    await expect(promise).rejects.toThrow()
  })

  test('should return surveys on success', async () => {
    const { sut } = makeSut()
    const surveys = await sut.load()
    expect(surveys).toEqual([mockSurveyModel()])
  })
})
