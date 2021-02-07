import { InvalidParamError } from '../../errors'
import { Validation } from '../../protocols/validation'

export class CompareFieldsValidation implements Validation {
  private readonly fieldName: string
  private readonly fieldToCompareName: string

  constructor (fieldName: string, fieldToCompareName) {
    this.fieldName = fieldName
    this.fieldToCompareName = fieldToCompareName
  }

  validate (params: any): Error {
    if (params[this.fieldName] !== params[this.fieldToCompareName]) {
      return new InvalidParamError(this.fieldToCompareName)
    }
  }
}
