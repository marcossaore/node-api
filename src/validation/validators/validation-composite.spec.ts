import { Validation } from '@/presentation/protocols'
import { mockValidation } from '../test'
import { ValidationComposite } from './validation-composite'

const makeSut = (validationsStub: Validation[]): Validation => {
  return new ValidationComposite(validationsStub)
}

describe('Validation Composite', () => {
  test('should call Validation Inject with correct values', () => {
    const validationsStub = [mockValidation()]
    const sut = makeSut(validationsStub)

    const validateSpy = jest.spyOn(validationsStub[0], 'validate')

    const data = {
      key: 'key',
      value: 'value'
    }

    sut.validate(data)

    expect(validateSpy).toHaveBeenCalledWith(data)
  })

  test('should return an error if an Validation returns an error', () => {
    const validations = [mockValidation(), mockValidation()]
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
