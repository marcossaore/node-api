import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollections = await MongoHelper.getCollection('accounts')
    await accountCollections.deleteMany({})
  })

  test('Should return 200 on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Ana Beatriz',
        email: 'anabtz@mail.com',
        password: '12345',
        passwordConfirmation: '12345'
      })
      .expect(200)

    await request(app)
      .post('/api/login')
      .send({
        email: 'anabtz@mail.com',
        password: '12345'
      }).expect(200)
  })
})
