import { Validation } from './protocols/validation'
import { ValidationComposite } from './validation-composite'

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (params: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

const makeSut = (validationsStub: Validation[]): Validation => {
  return new ValidationComposite(validationsStub)
}

describe('Validation Composite', () => {
  test('should call Validation Inject with correct values', () => {
    const validationsStub = [makeValidation()]
    const sut = makeSut(validationsStub)

    const validateSpy = jest.spyOn(validationsStub[0], 'validate')

    const data = {
      key: 'key',
      value: 'value'
    }

    sut.validate(data)

    expect(validateSpy).toHaveBeenCalledWith(data)
  })

  test('should return an error if an Validation throw', () => {
    const validations = [makeValidation(), makeValidation()]
    jest.spyOn(validations[0], 'validate').mockImplementationOnce(() => {
      return new Error('Error in first validation')
    })
    const sut = makeSut(validations)

    const data = {
      key: 'key',
      value: 'value'
    }

    const error = sut.validate(data)

    expect(error).toEqual(new Error('Error in first validation'))
  })
})
