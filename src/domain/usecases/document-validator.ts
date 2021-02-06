export interface DocumentValidator {
  apply: (document: string) => boolean
}
