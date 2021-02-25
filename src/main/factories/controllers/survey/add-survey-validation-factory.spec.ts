import { makeAddSurveyValidation } from './add-survey-validation-factory'
import { RequiredFieldValidation, ValidationComposite, ModelValidation } from '../../../../validation/validators'
import { AddSurveyModelValidator } from '../../../../validation/model-validators/add-survey-model-validator'
import { Validation } from '../../../../presentation/protocols'

jest.mock('../../../../validation/validators/validation-composite')

describe('SurveyValidation Factory', () => {
  test('should call ValidationComposite with all validations', () => {
    makeAddSurveyValidation()

    const validations: Validation[] = []

    const requiredFields = ['question', 'answers']
    for (const field of requiredFields) {
      validations.push(new RequiredFieldValidation(field))
    }
    const modelValidator = new AddSurveyModelValidator()
    validations.push(new ModelValidation(modelValidator))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
