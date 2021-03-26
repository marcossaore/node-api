import { DbAddSurvey } from './db-add-survey'
import { AddSurveyRepository } from './db-add-survey-protocols'
import { mockAddSurveyParams, throwError } from '@/domain/test'
import { mockAddSurveyRepository } from '@/data/test'
import MockDate from 'mockdate'

type SutTypes = {
  sut: DbAddSurvey
  addSurveyRepositoryStub: AddSurveyRepository
}

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = mockAddSurveyRepository()
  const sut = new DbAddSurvey(addSurveyRepositoryStub)
  return {
    sut,
    addSurveyRepositoryStub
  }
}

describe('DbAddSurvey', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })
  test('should call DbAddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
    const fakeSurvey = mockAddSurveyParams()
    await sut.add(fakeSurvey)
    expect(addSpy).toHaveBeenCalledWith(fakeSurvey)
  })

  test('should throw if DbAddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    jest.spyOn(addSurveyRepositoryStub, 'add').mockImplementationOnce(throwError)
    const fakeSurvey = mockAddSurveyParams()
    const promise = sut.add(fakeSurvey)
    await expect(promise).rejects.toThrow()
  })
})
