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
  ]
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
