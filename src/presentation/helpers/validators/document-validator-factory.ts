import { CPF } from './documents/cpf'
import { DocumentValidator } from './protocols/document-validator'

export const DocumentValidatorFactory = {
  make: (type: string): DocumentValidator => {
    if (type === 'cpf') {
      return new CPF()
    }
  }
}
