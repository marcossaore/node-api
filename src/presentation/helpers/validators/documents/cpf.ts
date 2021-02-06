import { DocumentValidator } from '../protocols/document-validator'
import { cpf } from 'cpf-cnpj-validator'

export class CPFValidator implements DocumentValidator {
  validate (document: string): boolean {
    return cpf.isValid(document)
  }
}
