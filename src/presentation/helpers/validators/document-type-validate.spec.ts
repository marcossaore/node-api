import { DocumentTypeValidate } from './document-type-validate'
import { DocumentValidator } from './protocols/document-validator'

const makeDocumentValidator = (): DocumentValidator => {
  class DocumentValidatorStub implements DocumentValidator {
    validate (document: string): boolean {
      return true
    }
  }

  return new DocumentValidatorStub()
}

const makeDocumentValidatorFactory = (): any => {
  return {
    make: (document: string): DocumentValidator => {
      return makeDocumentValidator()
    }
  }
}

interface SutTypes {
  sut: DocumentTypeValidate
  documentValidatorFactoryStub: any
}

const makeSut = (): SutTypes => {
  const documentValidatorFactoryStub = makeDocumentValidatorFactory()
  const sut = new DocumentTypeValidate(documentValidatorFactoryStub)
  return {
    sut,
    documentValidatorFactoryStub
  }
}

describe('DocumentType Validate', () => {
  test('should call DocumentValidatorFactory with correct value', () => {
    const { sut, documentValidatorFactoryStub } = makeSut()

    const makeSpy = jest.spyOn(documentValidatorFactoryStub, 'make')

    sut.hasValidation('any_validation')

    expect(makeSpy).toHaveBeenLastCalledWith('any_validation')
  })
})
