import { Validation } from '../../../presentation/protocols'
import { RequiredFieldValidation, TypeFieldValidation, TypeExpected, NoAllowEmptyArrayValidation } from '../../../validation/validators'
import { MapperModelValidator } from '../../../presentation/protocols/mapper-model-validator'

export const makeDefaultValidation = (mapperModelValidator: MapperModelValidator): Validation[] => {
  const validations: Validation[] = []

  for (const key in mapperModelValidator) {
    const object = mapperModelValidator[key]

    const { type , required } = object

    if (type) {
      validations.push(new TypeFieldValidation(key, type as TypeExpected))
    }

    if (required) {
      validations.push(new RequiredFieldValidation(key))
    }

    if (type === 'array') {
      if (object.noAllowEmptyArray) {
        validations.push(new NoAllowEmptyArrayValidation(key))
      }
    }
  }

  return validations
}
