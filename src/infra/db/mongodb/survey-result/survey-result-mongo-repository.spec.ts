import { SurveyVote } from '@/domain/usecases/save-survey-result'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import { Collection } from 'mongodb'

let accountCollection: Collection
let surveyCollection: Collection
let surveyResultCollection: Collection

const sut = new SurveyResultMongoRepository()

const createAccount = async (): Promise<string> => {
  const result = await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_emai@mail.com',
    password: 'any_password'
  })
  return result.ops[0]._id
}

const createSurvey = async (): Promise<string> => {
  const result = await surveyCollection.insertOne({
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer'
      }
    ],
    date: new Date()
  })
  return result.ops[0]._id
}

const makeFakeVote = async (): Promise<SurveyVote> => {
  const accountId = await createAccount()
  const surveyId = await createSurvey()
  return {
    surveyId,
    accountId,
    answer: 'any_answer',
    date: new Date()
  }
}

describe('SurveyResultMongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('save()', () => {
    test('should save a new vote', async () => {
      const fakeVote = await makeFakeVote()
      const surveyResult = await sut.save(fakeVote)
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.id).toBeTruthy()
      expect(surveyResult.surveyId).toEqual(fakeVote.surveyId)
      expect(surveyResult.accountId).toEqual(fakeVote.accountId)
      expect(surveyResult.answer).toBe('any_answer')
      expect(surveyResult.date).toBeTruthy()
    })

    test('should update a vote with other question', async () => {
      const fakeVote = await makeFakeVote()
      const surveyResult = await sut.save(fakeVote)
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.id).toBeTruthy()
      expect(surveyResult.answer).toBe('any_answer')
      const updateVote = Object.assign({}, fakeVote)
      updateVote.answer = 'other_answer'
      const updateSurveyResult = await sut.save(updateVote)
      expect(surveyResult.id).toEqual(updateSurveyResult.id)
      expect(updateSurveyResult).toBeTruthy()
      expect(updateSurveyResult.id).toBeTruthy()
      expect(updateSurveyResult.answer).toBe('other_answer')
    })
  })
})
