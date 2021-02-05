import { EmailValidator } from '../protocols/email-validator'
import { Validation } from './protocols/validation'

export class EmailValidation implements Validation {
  private readonly fieldName: string
  private readonly emailValidator: EmailValidator

  constructor (fieldName: string, emailValidator: EmailValidator) {
    this.fieldName = fieldName
    this.emailValidator = emailValidator
  }

  validate (params: any): Error {
    this.emailValidator.isValid(params[this.fieldName])
    return null
  }
}
