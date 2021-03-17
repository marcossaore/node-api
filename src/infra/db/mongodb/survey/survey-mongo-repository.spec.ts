import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'
import { AddSurveyModel } from '../../../../domain/usecases/add-survey'

const makeSurvey = (): AddSurveyModel => ({
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer'
    }
  ],
  date: new Date()
})

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
      const fakeSurvey = makeSurvey()
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
      const fakeSurveys = [makeSurvey(),makeSurvey()]
      await surveyCollection.insertMany(fakeSurveys, { ordered: true })
      const surveys = await sut.loadAll()
      expect(surveys).toBeTruthy()
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[0].question).toBe('any_question')
      expect(surveys[1].id).toBeTruthy()
      expect(surveys[1].question).toBe('any_question')
    })
  })
})
