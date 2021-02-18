import { DbAddSurvey } from './db-add-survey'
import { AddSurveyRepository } from '../../protocols/db/survey/add-survey-repository'
import { AddSurveyModel } from '../../../domain/usecases/add-survey'

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
  ]
})

const makeAddRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (data: AddSurveyModel): Promise<void> {

    }
  }

  return new AddSurveyRepositoryStub()
}

interface SutTypes {
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
