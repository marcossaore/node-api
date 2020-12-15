import { EmailValidatorAdapter } from './email-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail (): Boolean {
    return true
  }
}))

describe('EmailValidator Adapter', () => {
  test('should returns false if validator returns false', () => {
    const sut = new EmailValidatorAdapter()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid('invalid_email@maii.com')
    expect(isValid).toBe(false)
  })

  test('should returns true if validator returns true', () => {
    const emailValidatorAdapter = new EmailValidatorAdapter()
    const isValid = emailValidatorAdapter.isValid('valid_email@maii.com')
    expect(isValid).toBe(true)
  })
})
