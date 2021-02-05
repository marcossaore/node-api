import { InvalidParamError } from '../../errors'
import { CompareFieldValidation } from './compare-field-validation'

describe('Compare Field Validation', () => {
  test('should return a InvalidParamError if comparable fields to be diferents', () => {
    const data = {
      pass: 'value',
      confpass: 'diferent_value'
    }
    const sut = new CompareFieldValidation('pass', 'confpass')
    const error = sut.validate(data)
    expect(error).toEqual(new InvalidParamError('confpass'))
  })

  test('should not return when comparable fields to be equals', () => {
    const data = {
      pass: 'value',
      confpass: 'value'
    }
    const sut = new CompareFieldValidation('pass', 'confpass')
    const error = sut.validate(data)
    expect(error).toBeFalsy()
  })
})
