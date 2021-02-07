import { VerifyExistedAccountRepository } from '../../protocols/db/verify-existed-account-repository'
import { AccountModel } from '../add-account/db-add-account-protocols'
import { DbVerifyAccount } from './db-verify-account'

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email',
  password: 'any_password'
})

const makeVerifyExistedAccountRepository = (): VerifyExistedAccountRepository => {
  class DbVerifyAccountRepositoryStub implements VerifyExistedAccountRepository {
    async verify (email: string): Promise<AccountModel> {
      return null
    }
  }
  return new DbVerifyAccountRepositoryStub()
}

interface SutTypes {
  sut: DbVerifyAccount
  dbVerifyAccountRepositoryStub: VerifyExistedAccountRepository
}

const makeSut = (): SutTypes => {
  const dbVerifyAccountRepositoryStub = makeVerifyExistedAccountRepository()
  const sut = new DbVerifyAccount(dbVerifyAccountRepositoryStub)
  return {
    sut,
    dbVerifyAccountRepositoryStub
  }
}

describe('DbVerifyAccount UseCase', () => {
  test('should call VerifyExistedAccountRepository with correct email', async () => {
    const { sut, dbVerifyAccountRepositoryStub } = makeSut()
    const verifySpy = jest.spyOn(dbVerifyAccountRepositoryStub, 'verify')
    await sut.verify('any_email')
    expect(verifySpy).toHaveBeenCalledWith('any_email')
  })

  test('should return true if account exists', async () => {
    const { sut, dbVerifyAccountRepositoryStub } = makeSut()
    jest.spyOn(dbVerifyAccountRepositoryStub, 'verify').mockReturnValueOnce(Promise.resolve(makeFakeAccount()))
    const accountExists = await sut.verify('any_email')
    expect(accountExists).toBe(true)
  })

  test('should throw if VerifyExistedAccountRepository throws', async () => {
    const { sut, dbVerifyAccountRepositoryStub } = makeSut()
    jest.spyOn(dbVerifyAccountRepositoryStub, 'verify').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.verify('any_email')
    await expect(promise).rejects.toThrow()
  })

  test('should return false if not exists an account', async () => {
    const { sut } = makeSut()
    const accountExists = await sut.verify('any_email')
    expect(accountExists).toBe(false)
  })
})
