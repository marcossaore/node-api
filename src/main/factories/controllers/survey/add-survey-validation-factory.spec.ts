import { makeAddSurveyValidation } from './add-survey-validation-factory'
import { RequiredFieldValidation, ValidationComposite } from '../../../../validation/validators'
import { Validation } from '../../../../presentation/controllers/login/login-controller-protocols'

jest.mock('../../../../validation/validators/validation-composite')

describe('SurveyValidation Factory', () => {
  test('should call ValidationComposite with all validations', () => {
    makeAddSurveyValidation()

    const validations: Validation[] = []

    const requiredFields = ['question', 'answers']
    for (const field of requiredFields) {
      validations.push(new RequiredFieldValidation(field))
    }

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
