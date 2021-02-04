import { Validation } from './protocols/validation'
import { ValidationComposite } from './validation-composite'

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (value: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

interface SutTypes {
  sut: ValidationComposite
  validationsStub: Validation[]
}

const makeSut = (): SutTypes => {
  const validationsStub = [makeValidation()]
  const sut = new ValidationComposite(validationsStub)

  return {
    sut,
    validationsStub
  }
}

describe('Validation Composite', () => {
  test('should call Validation Inject with correct values', () => {
    const { sut, validationsStub } = makeSut()

    const validationStub = validationsStub[0]

    const validateSpy = jest.spyOn(validationStub, 'validate')

    const data = {
      key: 'key',
      value: 'value'
    }

    sut.validate(data)

    expect(validateSpy).toHaveBeenCalledWith(data)
  })
})
