import { TypeParamError } from '../../presentation/errors'
import { Validation } from '../../presentation/protocols'

export type TypeExpected = 'string' | 'number' | 'boolean' | 'undefined' | 'object' | 'function'

export class TypeFieldValidation implements Validation {
  private readonly fieldName: string
  private readonly typeExpected: TypeExpected

  constructor (fieldName: string, typeExpected: TypeExpected) {
    this.fieldName = fieldName
    this.typeExpected = typeExpected
  }

  validate (params: any): Error {
    // eslint-disable-next-line valid-typeof
    if (typeof params[this.fieldName] !== this.typeExpected) {
      return new TypeParamError(this.fieldName, this.typeExpected)
    }
  }
}
