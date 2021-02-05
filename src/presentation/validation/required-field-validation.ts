import { MissingParamError } from '../errors'
import { Validation } from '../validation/protocols/validation'

export class RequiredFieldValidation implements Validation {
  private readonly fieldName: string

  constructor (fieldName: string) {
    this.fieldName = fieldName
  }

  validate (params: any): Error {
    if (!params[this.fieldName]) {
      return new MissingParamError(this.fieldName)
    }
  }
}
