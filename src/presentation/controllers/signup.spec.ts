import { SignupController } from './signup'

describe('Signup Controller', () => {
  test('should return 400 if no name is provided', () => {
    //  system under test - SUT
    const sut = new SignupController()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })
})