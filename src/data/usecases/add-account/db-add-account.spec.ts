import { Encrypter } from '../../protocols/encrypter'
import { DbAddAccount } from './db-add-account'

describe('DbAddAccount Usecase', () => {
  test('Should call Encripter with correct password', async () => {
    class EncrypterStub implements Encrypter {
      async encrypt (value: string): Promise<string> {
        return Promise.resolve('hashed_password')
      }
    }

    const encrypterStub = new EncrypterStub()

    const sut = new DbAddAccount(encrypterStub)

    const encrypterSpy = jest.spyOn(encrypterStub, 'encrypt')

    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }

    await sut.add(accountData)

    expect(encrypterSpy).toHaveBeenCalledWith('valid_password')
  })
})
