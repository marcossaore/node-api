import { TypeValidation, Validation } from '../../presentation/protocols'

export class TypedFieldValidation implements Validation {
  private readonly fieldName: string
  private readonly typeValidation: TypeValidation

  constructor (fieldName: string, typeValidation: TypeValidation) {
    this.fieldName = fieldName
    this.typeValidation = typeValidation
  }

  validate (params: any): Error {
    this.typeValidation.validate(params[this.fieldName])
    return null
  }
}