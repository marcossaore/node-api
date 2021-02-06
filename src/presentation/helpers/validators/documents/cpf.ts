import { DocumentValidator } from '../protocols/document-validator'

export class CPF implements DocumentValidator {
  validate (document: string): boolean {
    return true
  }
}
