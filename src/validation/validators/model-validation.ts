import { ModelValidator, Validation } from '../../presentation/protocols'

export class ModelValidation implements Validation {
  private readonly modelValidator: ModelValidator

  constructor (modelValidator: ModelValidator) {
    this.modelValidator = modelValidator
  }

  validate (params: any): Error {
    const error = this.modelValidator.validate(params)
    if (error) {
      return error
    }
  }
}
