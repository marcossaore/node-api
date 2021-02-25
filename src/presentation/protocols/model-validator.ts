export interface ModelValidator {
  validate: (params: any) => Error
}
