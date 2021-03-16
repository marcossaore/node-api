import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import env from '../config/env'

let surveyCollection: Collection
let accountCollection: Collection

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
      const res = await accountCollection.insertOne({
        name: 'user',
        email: 'user@email.com',
        password: '123',
        role: 'admin'
      })

      const id = res.ops[0]._id
      const accessToken = sign({ id }, env.secret)

      await accountCollection.updateOne({
        _id: id
      }, {
        $set: {
          accessToken
        }
      })

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
})
