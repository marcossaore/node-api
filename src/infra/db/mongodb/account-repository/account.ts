import { AddAccountRepository } from '../../../../data/protocols/db/add-account-repository'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { AccountModel } from '../../../../domain/models/account'
import { MongoHelper } from '../helpers/mongo-helper'
import { VerifyExistedAccountRepository } from '../../../../data/protocols/db/verify-existed-account-repository'
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/load-account-by-email-repository'
import { UpdateAccessTokenRepository } from 'data/protocols/db/update-access-token-repository'
export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, VerifyExistedAccountRepository, UpdateAccessTokenRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)
    return MongoHelper.map(result.ops[0])
  }

  async verify (email: string): Promise<boolean> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.findOne({ email })
    return !!result
  }

  async loadByEmail (email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.findOne({ email })
    return result ? MongoHelper.map(result) : null
  }

  async updateAcessToken (id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.updateOne({ _id: id }, { $set: { accessToken: token } })
  }
}
