import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'

describe('Signup Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollections = await MongoHelper.getCollection('accounts')
    await accountCollections.deleteMany({})
  })

  test('Should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Ana Beatriz',
        email: 'anabtz@mail.com',
        password: '12345',
        passwordConfirmation: '12345'
      })
      .expect(200)
  })
})
