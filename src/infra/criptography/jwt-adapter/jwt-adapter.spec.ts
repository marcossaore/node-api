import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  sign: async (): Promise<string> => {
    return Promise.resolve('any_token')
  }
}))

describe('JWT Adapter', () => {
  test('should call sign with correct values', async () => {
    const secret = 'secret'
    const sut = new JwtAdapter(secret)
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('any_id')

    let expectInFirstParam = signSpy.mock.calls[0][0]
    expectInFirstParam = JSON.stringify(expectInFirstParam)
    expect(expectInFirstParam).toBe(JSON.stringify({ id: 'any_id' }))

    const expectInSecondParam = signSpy.mock.calls[0][1]
    expect(expectInSecondParam).toBe(secret)
  })

  test('should return a token on sign success', async () => {
    const secret = 'secret'
    const sut = new JwtAdapter(secret)
    const accessToken = await sut.encrypt('any_id')
    expect(accessToken).toBe('any_token')
  })

  test('should throw if sign throws', async () => {
    const secret = 'secret'
    const sut = new JwtAdapter(secret)
    jest.spyOn(jwt, 'sign').mockImplementationOnce((): any => {
      return Promise.reject(new Error())
    })
    const promise = sut.encrypt('any_id')
    await expect(promise).rejects.toThrow()
  })
})
