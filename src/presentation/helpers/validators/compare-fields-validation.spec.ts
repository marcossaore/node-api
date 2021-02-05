import { InvalidParamError } from '../../errors'
import { CompareFieldsValidation } from './compare-fields-validation'

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('pass', 'confpass')
}

describe('Compare Field Validation', () => {
  test('should return a InvalidParamError if comparable fields to be diferents', () => {
    const sut = makeSut()
    const error = sut.validate({
      pass: 'value',
      confpass: 'diferent_value'
    })
    expect(error).toEqual(new InvalidParamError('confpass'))
  })

  test('should not return fi validation succeeds', () => {
    const sut = makeSut()
    const error = sut.validate({
      pass: 'value',
      confpass: 'value'
    })
    expect(error).toBeFalsy()
  })
})
