import { DocumentTypeValidate } from './document-type-validate'
import { DocumentValidator } from './protocols/document-validator'

describe('Name of the group', () => {
  test('should call DocumentValidatorFactory with correct value', () => {
    class DocumentValidatorStub implements DocumentValidator {
      validate (document: string): boolean {
        return true
      }
    }

    const documentValidatorFactoryStub = {
      make: (document: string): DocumentValidator => {
        return new DocumentValidatorStub()
      }
    }

    const makeSpy = jest.spyOn(documentValidatorFactoryStub, 'make')
    const sut = new DocumentTypeValidate(documentValidatorFactoryStub)

    sut.hasValidation('any_validation')

    expect(makeSpy).toHaveBeenLastCalledWith('any_validation')
  })
})
