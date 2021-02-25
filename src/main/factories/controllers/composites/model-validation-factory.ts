import { RequiredFieldValidation, TypeFieldValidation, ValidationComposite, TypeExpected } from '../../../../validation/validators'
import { Validation } from '../../../../presentation/protocols'
import { MapperModel } from './mapper-model'

export class ModelValidation implements Validation {
  private readonly mapperModel: MapperModel
  private readonly validations: Validation[] = []
  private validationComposite: ValidationComposite

  constructor (mapperModel: MapperModel) {
    this.mapperModel = mapperModel
  }

  validate (params: any): any {
    for (const key in this.mapperModel) {
      const object = this.mapperModel[key]

      const type: TypeExpected = object.type as TypeExpected
      this.validations.push(new TypeFieldValidation(key, type))

      if (object.required) {
        this.validations.push(new RequiredFieldValidation(key))
      }
    }

    this.validationComposite = new ValidationComposite(this.validations)

    this.validationComposite.validate(params)

    return null
  }
}
