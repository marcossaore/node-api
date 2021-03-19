import { SaveSurveyResultRepository, SurveyVote, SurveyResultModel } from './db-save-survey-result-protocols'
import { DbSaveSurveyResult } from './db-save-survey-result'

const makeFakeResult = (): SurveyVote => ({
  questionId: 'any_question_id',
  answer: 'answer_1'
})

const makeFakeResultModel = (): SurveyResultModel => ({
  id: 'any_id',
  questionId: 'any_question_id',
  answers: [
    {
      answer: 'answer_1',
      votes: 1
    },
    {
      answer: 'answer_2',
      votes: 2
    }
  ]
})

const makeSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (surveyVote: SurveyVote): Promise<SurveyResultModel> {
      return makeFakeResultModel()
    }
  }
  return new SaveSurveyResultRepositoryStub()
}

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = makeSaveSurveyResultRepository()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub)
  return {
    sut,
    saveSurveyResultRepositoryStub
  }
}

describe('DbSaveSurveyResult UseCase', () => {
  test('should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save')
    await sut.save(makeFakeResult())
    expect(saveSpy).toHaveBeenCalledWith(makeFakeResult())
  })

  test('should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.save(makeFakeResult())
    await expect(promise).rejects.toThrow()
  })

  test('should return a survey result on success', async () => {
    const { sut } = makeSut()
    const surveyResult = await sut.save(makeFakeResult())
    expect(surveyResult).toEqual(makeFakeResultModel())
  })
})
