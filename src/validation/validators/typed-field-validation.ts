import { TypeValidator, Validation } from '../../presentation/protocols'

export class TypedFieldValidation implements Validation {
  private readonly fieldName: string
  private readonly typeValidator: TypeValidator

  constructor (fieldName: string, typeValidator: TypeValidator) {
    this.fieldName = fieldName
    this.typeValidator = typeValidator
  }

  validate (params: any): Error {
    const error = this.typeValidator.validate(params[this.fieldName])
    if (error) {
      return error
    }
  }
}
