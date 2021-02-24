import { TypeValidation } from '../../presentation/protocols'
import { TypedFieldValidation } from './typed-field-validation'

const makeFakeData = (): any => ({
  field: 'field'
})

const makeValidation = (): TypeValidation => {
  class TypeValidationStub implements TypeValidation {
    validate (params: any): Error {
      return null
    }
  }
  return new TypeValidationStub()
}

interface SutTypes {
  sut: TypedFieldValidation
  typeValidationStub: TypeValidation
}

const makeSut = (fieldName: string): SutTypes => {
  const typeValidationStub = makeValidation()
  const sut = new TypedFieldValidation(fieldName, typeValidationStub)
  return {
    sut,
    typeValidationStub
  }
}

describe('Typed Field Validation', () => {
  test('should call Validation with correct values', () => {
    const { sut, typeValidationStub } = makeSut('field')
    const validateSpy = jest.spyOn(typeValidationStub, 'validate')
    const fakeData = makeFakeData()
    sut.validate(fakeData)
    expect(validateSpy).toHaveBeenCalledWith(fakeData.field)
  })
})
