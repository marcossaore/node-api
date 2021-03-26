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
    question: 'any_question',
    answers: [
      {
        answer: 'any_answer'
      }
    ],
    date: new Date()
  }
}

const createSurveys = async (): Promise<void> => {
  await surveyCollection.insertMany([makeFakeSurvey(), makeFakeSurvey()], { ordered: true })
}

const extractAccessTokenFromAccount = async (): Promise<string> => {
  const response = await createAccount()
  const id = response.ops[0]._id
  const accessToken = sign({ id }, env.secret)
  await updateAccount(id, accessToken)
  return accessToken
}

describe('Survey Routes', () => {
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

  describe('POST /surveys', () => {
    test('Should return 403 on add survey without accessToken', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'What is the hatest fruit?',
          answers: [
            {
              image: 'http://banana.jpg',
              answer: 'banana'
            },
            {
              answer: 'apple'
            },
            {
              answer: 'strawberry'
            }
          ]
        })
        .expect(403)
    })

    test('Should return 204 on add survey with valid accessToken', async () => {
      const accessToken = await extractAccessTokenFromAccount()
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send({
          question: 'What is the hatest fruit?',
          answers: [
            {
              image: 'http://banana.jpg',
              answer: 'banana'
            },
            {
              answer: 'apple'
            },
            {
              answer: 'strawberry'
            }
          ]
        })
        .expect(204)
    })
  })

  describe('get /surveys', () => {
    test('Should return 403 on load survey without accessToken', async () => {
      await request(app)
        .get('/api/surveys')
        .expect(403)
    })

    test('Should return 204 on load survey with accessToken if no exists surveys', async () => {
      const accessToken = await extractAccessTokenFromAccount()
      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(204)
    })

    test('Should return 200 on load survey with accessToken on success', async () => {
      await createSurveys()
      const accessToken = await extractAccessTokenFromAccount()
      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(200)
    })
  })
})
