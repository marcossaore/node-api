import { TypeParamError } from '../../presentation/errors'
import { TypeValidator } from '../../presentation/protocols'
import { TypedFieldValidation } from './typed-field-validation'

const makeFakeData = (): any => ({
  field: 'field'
})

const makeValidation = (): TypeValidator => {
  class TypeValidatorStub implements TypeValidator {
    validate (params: any): Error {
      return null
    }
  }
  return new TypeValidatorStub()
}

interface SutTypes {
  sut: TypedFieldValidation
  typeValidatorStub: TypeValidator
}

const makeSut = (fieldName: string): SutTypes => {
  const typeValidatorStub = makeValidation()
  const sut = new TypedFieldValidation(fieldName, typeValidatorStub)
  return {
    sut,
    typeValidatorStub
  }
}

describe('Typed Field Validation', () => {
  test('should call TypeFieldValidation with correct values', () => {
    const { sut, typeValidatorStub } = makeSut('field')
    const validateSpy = jest.spyOn(typeValidatorStub, 'validate')
    const fakeData = makeFakeData()
    sut.validate(fakeData)
    expect(validateSpy).toHaveBeenCalledWith(fakeData.field)
  })

  test('should return a TypeParamError if a field no applies correct type', () => {
    const { sut, typeValidatorStub } = makeSut('field')
    jest.spyOn(typeValidatorStub, 'validate').mockReturnValueOnce(new TypeParamError('field', 'string'))
    const fakeData = makeFakeData()
    const error = sut.validate(fakeData)
    expect(error).toEqual(new TypeParamError('field', 'string'))
  })

  test('should throw if TypeFieldValidation throws', () => {
    const { sut, typeValidatorStub } = makeSut('field')
    jest.spyOn(typeValidatorStub, 'validate').mockImplementationOnce(() => {
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
