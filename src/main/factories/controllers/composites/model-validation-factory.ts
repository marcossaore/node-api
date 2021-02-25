import { RequiredFieldValidation, TypeFieldValidation, ValidationComposite, TypeExpected, NoAllowEmptyArrayValidation } from '../../../../validation/validators'
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

      if (type === 'array') {
        if (object.noAllowEmptyArray) {
          this.validations.push(new NoAllowEmptyArrayValidation(key))
        }
      }

      if (object.customValidations) {
        object.customValidations.map((validation) => this.validations.push(validation))
      }
    }

    this.validationComposite = new ValidationComposite(this.validations)

    this.validationComposite.validate(params)

    return null
  }
}
