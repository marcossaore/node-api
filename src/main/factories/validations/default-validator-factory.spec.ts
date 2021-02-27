import { makeDefaultValidation } from './default-validator-factory'
import { NoAllowEmptyArrayValidation, RequiredFieldValidation, TypeExpected, TypeFieldValidation } from '../../../validation/validators'
import { MapperModelValidator } from '../../../presentation/protocols/mapper-model-validator'

const makeTypeFieldValidation = (param: string, typeExpected: TypeExpected): TypeFieldValidation => {
  return new TypeFieldValidation(param, typeExpected)
}

const makeRequiredFieldValidation = (param: string): RequiredFieldValidation => {
  return new RequiredFieldValidation(param)
}

const makeNoAllowEmptyArrayValidation = (param: string): NoAllowEmptyArrayValidation => {
  return new NoAllowEmptyArrayValidation(param)
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('Model Validator Factory', () => {
  test('should call TypeFieldValidation with correct value', () => {
    const mapperModel: MapperModelValidator = {
      name: {
        type: 'string'
      }
    }
    expect(makeDefaultValidation(mapperModel)).toEqual([makeTypeFieldValidation('name', 'string')])
  })

  test('should call RequiredFieldValidation with correct value if required', () => {
    const mapperModel: MapperModelValidator = {
      name: {
        type: 'string',
        required: true
      }
    }
    const validations = makeDefaultValidation(mapperModel)
    const expectedValidations = [
      makeTypeFieldValidation('name', 'string'),
      makeRequiredFieldValidation('name')
    ]
    expect(validations).toEqual(expectedValidations)
  })

  test('should not call RequiredFieldValidation if mapper disable required', () => {
    const mapperModel: MapperModelValidator = {
      name: {
        type: 'string',
        required: false
      }
    }
    const validations = makeDefaultValidation(mapperModel)
    makeDefaultValidation(mapperModel)
    expect(validations).toEqual([makeTypeFieldValidation('name', 'string')])
  })

  test('should call ModelValidation if required', () => {
    const mapperModel: MapperModelValidator = {
      name: {
        type: 'string',
        required: true
      }
    }
    const expectedValidations = [
      makeTypeFieldValidation('name', 'string'),
      makeRequiredFieldValidation('name')
    ]
    const validations = makeDefaultValidation(mapperModel)
    expect(validations).toEqual(expectedValidations)
  })

  test('should call NoAllowEmptyArrayValidation field array cant be empty is provided', () => {
    const mapperModel: MapperModelValidator = {
      name: {
        type: 'array',
        noAllowEmptyArray: true
      }
    }
    const expectedValidations = [
      makeTypeFieldValidation('name', 'array'),
      makeNoAllowEmptyArrayValidation('name')
    ]
    const validations = makeDefaultValidation(mapperModel)
    expect(validations).toEqual(expectedValidations)
  })

  test('should not call NoAllowEmptyArrayValidation field array can be empty is provided', () => {
    const mapperModel: MapperModelValidator = {
      name: {
        type: 'array'
      }
    }
    const expectedValidations = [
      makeTypeFieldValidation('name', 'array')
    ]
    const validations = makeDefaultValidation(mapperModel)
    expect(validations).toEqual(expectedValidations)
  })

  test('should call Validation value if field array can be empty is provided', () => {
    const mapperModel: MapperModelValidator = {
      name: {
        type: 'array'
      }
    }
    const expectedValidations = [
      makeTypeFieldValidation('name', 'array')
    ]
    const validations = makeDefaultValidation(mapperModel)
    expect(validations).toEqual(expectedValidations)
  })
})
