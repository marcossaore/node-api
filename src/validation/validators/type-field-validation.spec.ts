import { TypeParamError } from '@/presentation/errors'
import { TypeFieldValidation } from './type-field-validation'

describe('Required Field Validation', () => {
  test('should return a TypeParamError if field is boolean and the value provided is string', () => {
    const data = {
      field: 'any_value'
    }
    const sut = new TypeFieldValidation('field', 'boolean')
    const error = sut.validate(data)
    expect(error).toEqual(new TypeParamError('field', 'boolean'))
  })

  test('should return a TypeParamError if field is string and the value provided is boolean', () => {
    const data = {
      field: true
    }
    const sut = new TypeFieldValidation('field', 'string')
    const error = sut.validate(data)
    expect(error).toEqual(new TypeParamError('field', 'string'))
  })

  test('should return a TypeParamError if field is array and the value provided is boolean', () => {
    const data = {
      field: true
    }
    const sut = new TypeFieldValidation('field', 'array')
    const error = sut.validate(data)
    expect(error).toEqual(new TypeParamError('field', 'array'))
  })

  test('should not return on success if array type', () => {
    const data = {
      field: []
    }
    const sut = new TypeFieldValidation('field', 'array')
    const error = sut.validate(data)
    expect(error).toBeFalsy()
  })

  test('should not return on success if string type', () => {
    const data = {
      field: 'any_value'
    }
    const sut = new TypeFieldValidation('field', 'string')
    const error = sut.validate(data)
    expect(error).toBeFalsy()
  })

  test('should not return on success if boolean type', () => {
    const data = {
      field: false
    }
    const sut = new TypeFieldValidation('field', 'boolean')
    const error = sut.validate(data)
    expect(error).toBeFalsy()
  })

  test('should not return on success if boolean type', () => {
    const data = {
      field: false
    }
    const sut = new TypeFieldValidation('field', 'boolean')
    const error = sut.validate(data)
    expect(error).toBeFalsy()
  })

  test('should not return on success if object type', () => {
    const data = {
      field: {}
    }
    const sut = new TypeFieldValidation('field', 'object')
    const error = sut.validate(data)
    expect(error).toBeFalsy()
  })
})
