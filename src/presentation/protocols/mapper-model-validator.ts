import { Validation } from '../protocols/validation'

export interface MapperModelValidator {
  [dynamickey: string]: {
    type: string
    required?: boolean
    customValidations?: [Validation]
    noAllowEmptyArray?: boolean
  }
}
