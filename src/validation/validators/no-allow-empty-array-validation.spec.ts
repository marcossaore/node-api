import { NoAllowEmptyArrayError } from '@/presentation/errors'
import { NoAllowEmptyArrayValidation } from './no-allow-empty-array-validation'

describe('NoAllowEmptyArray Validation', () => {
  test('should return NoAllowEmptyArrayError if empty array is provided', () => {
    const data = {
      arrayField: []
    }
    const sut = new NoAllowEmptyArrayValidation('arrayField')
    const error = sut.validate(data)
    expect(error).toEqual(new NoAllowEmptyArrayError('arrayField'))
  })

  test('should return NoAllowEmptyArrayError if null is provided as array', () => {
    const data = {
      arrayField: null
    }
    const sut = new NoAllowEmptyArrayValidation('arrayField')
    const error = sut.validate(data)
    expect(error).toEqual(new NoAllowEmptyArrayError('arrayField'))
  })
})
