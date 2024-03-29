import { Validation } from '@/presentation/protocols'

export class ValidationComposite implements Validation {
  private readonly validations: Validation[]

  constructor (validations: Validation[]) {
    this.validations = validations
  }

  validate (params: any): Error {
    for (const validation of this.validations) {
      const error = validation.validate(params)
      if (error) {
        return error
      }
    }
  }
}
