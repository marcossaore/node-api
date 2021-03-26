import request from 'supertest'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import app from '@/main/config/app'
import env from '@/main/config/env'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import { AddSurveyParams } from '@/domain/usecases/survey/add-survey'

let surveyCollection: Collection
let accountCollection: Collection

const createAccount = async (): Promise<any> => {
  return await accountCollection.insertOne({
    name: 'user',
    email: 'user@email.com',
    password: '123',
    role: 'admin'
  })
}

const updateAccount = async (id, accessToken): Promise<void> => {
  await accountCollection.updateOne({
    _id: id
  }, {
    $set: {
      accessToken
    }
  })
}

const makeFakeSurvey = (): AddSurveyParams => {
  return {
    question: 'important question',
    answers: [
      {
        answer: 'answer 1'
      },
      {
        answer: 'answer 2'
      }
    ],
    date: new Date()
  }
}

const createSurvey = async (): Promise<string> => {
  const result = await surveyCollection.insertOne(makeFakeSurvey())
  return result.ops[0]._id
}

const extractAccessTokenFromAccount = async (): Promise<string> => {
  const response = await createAccount()
  const id = response.ops[0]._id
  const accessToken = sign({ id }, env.secret)
  await updateAccount(id, accessToken)
  return accessToken
}

describe('Survey Result Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('PUT /surveys/:surveyId/results', () => {
    test('Should return 403 on save survey result without accessToken', async () => {
      const surveyId = await createSurvey()
      await request(app)
        .put(`/api/surveys/${surveyId}/results`)
        .expect(403)
    })

    test('Should return 400 on save survey result with accessToken and answer is not provided', async () => {
      const accessToken = await extractAccessTokenFromAccount()
      const surveyId = await createSurvey()
      await request(app)
        .put(`/api/surveys/${surveyId}/results`)
        .set('x-access-token', accessToken)
        .expect(400)
    })

    test('Should return 403 on save survey result with accessToken and wrong answer', async () => {
      const accessToken = await extractAccessTokenFromAccount()
      const surveyId = await createSurvey()
      await request(app)
        .put(`/api/surveys/${surveyId}/results`)
        .set('x-access-token', accessToken)
        .send({
          answer: 'wrong_answer'
        })
        .expect(403)
    })

    test('Should return 200 on save survey result with accessToken on success', async () => {
      const accessToken = await extractAccessTokenFromAccount()
      const surveyId = await createSurvey()
      await request(app)
        .put(`/api/surveys/${surveyId}/results`)
        .set('x-access-token', accessToken)
        .send({
          answer: 'answer 2'
        })
        .expect(200)
    })
  })
})
