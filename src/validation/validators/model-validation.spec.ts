import { TypeParamError } from '../../presentation/errors'
import { ModelValidator } from '../../presentation/protocols'
import { ModelValidation } from './model-validation'

const makeFakeData = (): any => ({
  field: 'field'
})

const makeModelValidation = (): ModelValidator => {
  class ModelValidatorStub implements ModelValidator {
    validate (params: any): Error {
      return null
    }
  }
  return new ModelValidatorStub()
}

interface SutTypes {
  sut: ModelValidation
  modelValidatorStub: ModelValidator
}

const makeSut = (fieldName: string): SutTypes => {
  const modelValidatorStub = makeModelValidation()
  const sut = new ModelValidation(fieldName, modelValidatorStub)
  return {
    sut,
    modelValidatorStub
  }
}

describe('Typed Field Validation', () => {
  test('should call TypeFieldValidation with correct values', () => {
    const { sut, modelValidatorStub } = makeSut('field')
    const validateSpy = jest.spyOn(modelValidatorStub, 'validate')
    const fakeData = makeFakeData()
    sut.validate(fakeData)
    expect(validateSpy).toHaveBeenCalledWith(fakeData)
  })

  test('should return a TypeParamError if a field no applies correct type', () => {
    const { sut, modelValidatorStub } = makeSut('field')
    jest.spyOn(modelValidatorStub, 'validate').mockReturnValueOnce(new TypeParamError('field', 'string'))
    const fakeData = makeFakeData()
    const error = sut.validate(fakeData)
    expect(error).toEqual(new TypeParamError('field', 'string'))
  })

  test('should throw if TypeFieldValidation throws', () => {
    const { sut, modelValidatorStub } = makeSut('field')
    jest.spyOn(modelValidatorStub, 'validate').mockImplementationOnce(() => {
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
