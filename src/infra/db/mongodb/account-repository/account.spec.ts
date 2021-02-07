import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

const makeAccount = (): AddAccountModel => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})

describe('Account Mongo Repository', () => {
  let accountCollections: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollections = await MongoHelper.getCollection('accounts')
    await accountCollections.deleteMany({})
  })

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  test('Should return an account on success', async () => {
    const sut = makeSut()
    const account = await sut.add(makeAccount())

    expect(account).toBeTruthy()

    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@mail.com')
    expect(account.password).toBe('any_password')
  })

  test('should return an account if email provided exists on db', async () => {
    await accountCollections.insertOne(makeAccount())

    const sut = makeSut()
    const account = await sut.verify('any_email@mail.com')

    expect(account).toBeTruthy()

    expect(account.id).toBeTruthy()
    expect(account.email).toBe('any_email@mail.com')
  })

  test('should return null if email provided no exists on db', async () => {
    const sut = makeSut()
    const account = await sut.verify('any_email@mail.com')
    expect(account).toBeNull()
  })
})
