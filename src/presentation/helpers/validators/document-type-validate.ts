
import { DocumentTypeValidator } from './protocols/document-type-validator'
import { DocumentValidator } from './protocols/document-validator'

export class DocumentTypeValidate implements DocumentTypeValidator {
  private readonly documentValidatorFactory: any

  constructor (documentValidatorFactory: any) {
    this.documentValidatorFactory = documentValidatorFactory
  }

  hasValidation (type: string): DocumentValidator {
    return this.documentValidatorFactory.make(type)
  }
}
