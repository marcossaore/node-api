import { TypeParamError } from '../../presentation/errors'
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
  test('should call TypeFieldValidation with correct values', () => {
    const { sut, typeValidationStub } = makeSut('field')
    const validateSpy = jest.spyOn(typeValidationStub, 'validate')
    const fakeData = makeFakeData()
    sut.validate(fakeData)
    expect(validateSpy).toHaveBeenCalledWith(fakeData.field)
  })

  test('should return a TypeParamError if a field no applies correct type', () => {
    const { sut, typeValidationStub } = makeSut('field')
    jest.spyOn(typeValidationStub, 'validate').mockReturnValueOnce(new TypeParamError('field', 'string'))
    const fakeData = makeFakeData()
    const error = sut.validate(fakeData)
    expect(error).toEqual(new TypeParamError('field', 'string'))
  })

  test('should throw if TypeFieldValidation throws', () => {
    const { sut, typeValidationStub } = makeSut('field')
    jest.spyOn(typeValidationStub, 'validate').mockImplementationOnce(() => {
      throw new Error()
    })
    expect(sut.validate).toThrow()
  })

  test('should not return on success', () => {
    const { sut } = makeSut('field')
    const fakeData = makeFakeData()
    const error = sut.validate(fakeData)
    expect(error).toBeFalsy()
  })
})
