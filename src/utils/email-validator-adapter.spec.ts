import { EmailValidatorAdapter } from './email-validator-adapter'

describe('EmailValidator Adapter', () => {
  test('should returns false if validator returns false', () => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid('invalid_email@maii.com')
    expect(isValid).toBe(false)
  })

  // test('should returns true when email is valid', () => {
  //   const emailValidatorAdapter = new EmailValidatorAdapter()
  //   const isValid = emailValidatorAdapter.isValid('mail@maii.com')
  //   expect(isValid).toBe(true)
  // })
})
