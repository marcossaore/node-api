export interface MapperModelValidator {
  [dynamickey: string]: {
    type: string
    required?: boolean
    noAllowEmptyArray?: boolean
  }
}
