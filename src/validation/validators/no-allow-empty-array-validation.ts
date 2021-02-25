import { NoAllowEmptyArrayError } from '../../presentation/errors'
import { Validation } from '../../presentation/protocols'

export class NoAllowEmptyArrayValidation implements Validation {
  private readonly fieldName: string

  constructor (fieldName: string) {
    this.fieldName = fieldName
  }

  validate (params: any): Error {
    if (!Array.isArray(params[this.fieldName]) || params[this.fieldName].length === 0) {
      return new NoAllowEmptyArrayError(this.fieldName)
    }
  }
}
