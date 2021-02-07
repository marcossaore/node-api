import { VerifyExistedAccountRepository } from '../../protocols/db/verify-existed-account-repository'
import { AccountModel } from '../add-account/db-add-account-protocols'
import { DbVerifyAccount } from './db-verify-account'

describe('DbVerifyAccount UseCase', () => {
  test('should call VerifyExistedAccountRepository with correct email', async () => {
    class DbVerifyAccountRepositoryStub implements VerifyExistedAccountRepository {
      async verify (email: string): Promise<AccountModel> {
        const fakeAccount: AccountModel = {
          id: 'any_id',
          name: 'any_name',
          email: 'any_email',
          password: 'any_password'
        }
        return fakeAccount
      }
    }
    const dbVerifyAccountRepositoryStub = new DbVerifyAccountRepositoryStub()
    const sut = new DbVerifyAccount(dbVerifyAccountRepositoryStub)
    const verifySpy = jest.spyOn(dbVerifyAccountRepositoryStub, 'verify')
    await sut.verify('any_email')
    expect(verifySpy).toHaveBeenCalledWith('any_email')
  })
})
