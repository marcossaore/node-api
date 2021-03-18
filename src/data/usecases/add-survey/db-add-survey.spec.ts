import { DbAddSurvey } from './db-add-survey'
import { AddSurveyModel, AddSurveyRepository } from './db-add-survey-protocols'
import MockDate from 'mockdate'

const makeFakeSurvey = (): AddSurveyModel => ({
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer'
    },
    {
      answer: 'any_answer'
    }
  ],
  date: new Date()
})

const makeAddRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (data: AddSurveyModel): Promise<void> {

    }
  }

  return new AddSurveyRepositoryStub()
}

type SutTypes = {
  sut: DbAddSurvey
  surveyAddRepositoryStub: AddSurveyRepository
}

const makeSut = (): SutTypes => {
  const surveyAddRepositoryStub = makeAddRepository()
  const sut = new DbAddSurvey(surveyAddRepositoryStub)
  return {
    sut,
    surveyAddRepositoryStub
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
    const { sut, surveyAddRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(surveyAddRepositoryStub, 'add')
    const fakeSurvey = makeFakeSurvey()
    await sut.add(fakeSurvey)
    expect(addSpy).toHaveBeenCalledWith(fakeSurvey)
  })

  test('should throw if DbAddSurveyRepository throws', async () => {
    const { sut, surveyAddRepositoryStub } = makeSut()
    jest.spyOn(surveyAddRepositoryStub, 'add').mockImplementationOnce(() => {
      throw new Error()
    })
    const fakeSurvey = makeFakeSurvey()
    const promise = sut.add(fakeSurvey)
    await expect(promise).rejects.toThrow()
  })
})
