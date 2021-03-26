import { SurveyMongoRepository } from './survey-mongo-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import { Collection } from 'mongodb'
import { mockAddSurveyParams } from '@/domain/test'

describe('Survey Mongo Repository', () => {
  let surveyCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

  const makeSut = (): SurveyMongoRepository => {
    return new SurveyMongoRepository()
  }

  describe('add()', () => {
    test('Should return an survey on add success', async () => {
      const sut = makeSut()
      const fakeSurvey = mockAddSurveyParams()
      await sut.add(fakeSurvey)
      const survey = await surveyCollection.findOne({ question: fakeSurvey.question })
      expect(survey).toBeTruthy()
      expect(survey.question).toBe('any_question')
      expect(survey.answers[0].image).toBe('any_image')
      expect(survey.answers[0].answer).toBe('any_answer')
    })
  })

  describe('loadAll()', () => {
    test('should return surveys on load success', async () => {
      const sut = makeSut()
      const fakeSurveys = [mockAddSurveyParams(),mockAddSurveyParams()]
      await surveyCollection.insertMany(fakeSurveys, { ordered: true })
      const surveys = await sut.loadAll()
      expect(surveys).toBeTruthy()
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[0].question).toBe('any_question')
      expect(surveys[1].id).toBeTruthy()
      expect(surveys[1].question).toBe('any_question')
    })
  })

  describe('loadById()', () => {
    test('should return an survey on success', async () => {
      const sut = makeSut()
      const fakeSurvey = mockAddSurveyParams()
      const result = await surveyCollection.insertOne(fakeSurvey)
      const id = result.ops[0]._id
      const survey = await sut.loadById(id)
      expect(survey).toBeTruthy()
      expect(survey.id).toEqual(id)
      expect(survey.question).toEqual(fakeSurvey.question)
      expect(survey.answers).toEqual(fakeSurvey.answers)
    })
  })
})
