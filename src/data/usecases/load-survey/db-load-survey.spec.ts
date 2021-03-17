import { SurveyModel, LoadSurveyRepository } from './db-load-survey-protocols'
import { DbLoadSurvey } from './db-load-survey'

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
  test('should call LoadSurveyRepository correctly', async () => {
    const { sut, loadSurveyRepositorystub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyRepositorystub, 'loadAll')
    await sut.load()
    expect(loadSpy).toHaveBeenCalled()
  })
})
