import { RequiredFieldValidation, ValidationComposite, ModelValidation } from '../../../../validation/validators'
import { Validation } from '../../../../presentation/protocols'
import { AddSurveyModelValidator } from '../../../../validation/model-validators/add-survey-model-validator'

export const makeAddSurveyValidation = (): Validation => {
  const validations: Validation[] = []

  const requiredFields = ['question', 'answers']
  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field))
  }

  const modelValidator = new AddSurveyModelValidator()
  validations.push(new ModelValidation(modelValidator))

  return new ValidationComposite(validations)
}
