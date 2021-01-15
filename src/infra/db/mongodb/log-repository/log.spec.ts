import { LogMongoRepository } from './log'
import { MongoHelper } from '../helpers/mongo-helper'
import { Collection } from 'mongodb'

describe('LogMongo Repository', () => {
  let errorCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('errors')
    await errorCollection.deleteMany({})
  })

  test('should create a log in collection', async () => {
    const logMongoErrorRepository = new LogMongoRepository()
    await logMongoErrorRepository.logError('any_error')
    const count = await errorCollection.countDocuments()
    expect(count).toBe(1)
  })
})
