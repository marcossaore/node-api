
import { SurveyModel, LoadSurvey, HttpRequest } from './load-survey-controller-protocols'
import { LoadSurveyController } from './load-survey-controller'

const makeFakeRequest = (): HttpRequest => ({
  body: null,
  headers: null
})

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

const makeLoadSurvey = (): LoadSurvey => {
  class LoadSurveyStub implements LoadSurvey {
    async load (): Promise<SurveyModel[]> {
      return [makeFakeSurvey()]
    }
  }
  return new LoadSurveyStub()
}

type SutTypes = {
  sut: LoadSurveyController
  loadSurveyStub: LoadSurvey
}

const makeSut = (): SutTypes => {
  const loadSurveyStub = makeLoadSurvey()
  const sut = new LoadSurveyController(loadSurveyStub)
  return {
    sut,
    loadSurveyStub
  }
}
describe('LoadSurvey Controller', () => {
  test('should call LoadSurvey use case correctly', async () => {
    const { sut, loadSurveyStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyStub, 'load')
    await sut.handle(makeFakeRequest())
    expect(loadSpy).toHaveBeenCalled()
  })
})
