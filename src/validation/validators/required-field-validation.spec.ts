import { MissingParamError } from '../../presentation/errors'
import { RequiredFieldValidation } from './required-field-validation'

describe('Required Field Validation', () => {
  test('should return a MissingParamError if an required field is no provided', () => {
    const data = {
      any: 'any'
    }
    const sut = new RequiredFieldValidation('fieldRequired')
    const error = sut.validate(data)
    expect(error).toEqual(new MissingParamError('fieldRequired'))
  })

  test('should return any if required field is provided', () => {
    const data = {
      fieldRequired: 'any'
    }
    const sut = new RequiredFieldValidation('fieldRequired')
    const error = sut.validate(data)
    expect(error).toBeFalsy()
  })
})
