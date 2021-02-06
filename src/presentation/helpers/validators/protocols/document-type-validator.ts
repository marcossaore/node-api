import { DocumentValidator } from '../../../../domain/usecases/document-validator'

export interface DocumentTypeValidator {
  hasValidation: (type: string) => DocumentValidator
}
