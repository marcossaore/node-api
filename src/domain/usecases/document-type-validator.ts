import { DocumentValidator } from './document-validator'

export interface DocumentTypeValidator {
  hasValidation: (type: string) => DocumentValidator
}
