import { Validation } from '../../../../presentation/protocols'

export interface MapperModel {
  [dynamickey: string]: {
    type: string
    required?: boolean
    addCustomValidations?: [Validation]
    noAllowEmptyArray?: boolean
    requiredSubFields?: {
      [dynamickeysubfield: string]: {
        type: string
        required?: boolean
        addValidations?: [Validation]
        allowArrayEmpty?: boolean
      }
    }
  }
}
