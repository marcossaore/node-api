import { ModelValidation } from './model-validation-factory'
import { NoAllowEmptyArrayValidation, RequiredFieldValidation, TypeExpected, TypeFieldValidation, ValidationComposite } from '../../../../validation/validators'
import { MapperModel } from './mapper-model'
import { Validation } from '../../../../presentation/protocols'

const makeFakeData = (): any => ({
  name: 'any_name'
})

const makeTypeFieldValidation = (param: string, typeExpected: TypeExpected): TypeFieldValidation => {
  return new TypeFieldValidation(param, typeExpected)
}

const makeRequiredFieldValidation = (param: string): RequiredFieldValidation => {
  return new RequiredFieldValidation(param)
}

const makeNoAllowEmptyArrayValidation = (param: string): NoAllowEmptyArrayValidation => {
  return new NoAllowEmptyArrayValidation(param)
}

interface SutTypes {
  sut: ModelValidation
  validations: Validation[]
}
const makeSut = (mapperModel: MapperModel): SutTypes => {
  const validations: Validation[] = []
  const sut = new ModelValidation(mapperModel)
  return {
    sut,
    validations
  }
}

jest.mock('../../../../validation/validators/validation-composite')

beforeEach(() => {
  jest.clearAllMocks()
})

describe('Model Validator Factory', () => {
  test('should call TypeFieldValidation with correct value', () => {
    const mapperModel: MapperModel = {
      name: {
        type: 'string'
      }
    }
    const { sut, validations } = makeSut(mapperModel)
    validations.push(makeTypeFieldValidation('name', 'string'))

    sut.validate(makeFakeData())
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })

  test('should call RequiredFieldValidation with correct value if required', () => {
    const mapperModel: MapperModel = {
      name: {
        type: 'string',
        required: true
      }
    }

    const { sut, validations } = makeSut(mapperModel)

    validations.push(makeTypeFieldValidation('name', 'string'))
    validations.push(makeRequiredFieldValidation('name'))

    sut.validate(makeFakeData())
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })

  test('should not call RequiredFieldValidation if mapper disable required', () => {
    const mapperModel: MapperModel = {
      name: {
        type: 'string',
        required: false
      }
    }

    const validations: Validation[] = []
    validations.push(new TypeFieldValidation('name', 'string'))

    const sut = new ModelValidation(mapperModel)
    const data = {
      name: 'any_name'
    }
    sut.validate(data)
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })

  test('should call ModelValidation with correct value if required', () => {
    const mapperModel: MapperModel = {
      name: {
        type: 'string',
        required: true
      }
    }

    const { sut, validations } = makeSut(mapperModel)

    validations.push(makeTypeFieldValidation('name', 'string'))
    validations.push(makeRequiredFieldValidation('name'))

    sut.validate(makeFakeData())
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })

  test('should call NoAllowEmptyArrayValidation with correct value if field array cant be empty is provided', () => {
    const mapperModel: MapperModel = {
      name: {
        type: 'array',
        noAllowEmptyArray: true
      }
    }

    const { sut, validations } = makeSut(mapperModel)

    validations.push(makeTypeFieldValidation('name', 'array'))
    validations.push(makeNoAllowEmptyArrayValidation('name'))

    sut.validate(makeFakeData())
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })

  test('should not call NoAllowEmptyArrayValidation with correct value if field array can be empty is provided', () => {
    const mapperModel: MapperModel = {
      name: {
        type: 'array'
      }
    }

    const { sut, validations } = makeSut(mapperModel)

    validations.push(makeTypeFieldValidation('name', 'array'))

    sut.validate(makeFakeData())
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
