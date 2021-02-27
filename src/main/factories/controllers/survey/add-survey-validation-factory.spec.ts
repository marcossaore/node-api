import { makeAddSurveyValidation } from './add-survey-validation-factory'
import { ValidationComposite } from '../../../../validation/validators'
import { AddSurveyModelValidator } from '../../../../validation/model-validators/add-survey-model-validator'
import { MapperModelValidator } from '../../../../presentation/protocols/mapper-model-validator'
import { makeDefaultValidation } from '../../validations/default-validator-factory'

jest.mock('../../../../validation/validators/validation-composite')

describe('SurveyValidation Factory', () => {
  test('should call ValidationComposite with all validations', () => {
    makeAddSurveyValidation()

    const addSurveyMapperValidator: MapperModelValidator = {
      question: {
        type: 'string',
        required: true
      },
      answers: {
        type: 'array',
        noAllowEmptyArray: true,
        required: true
      }
    }

    const validations = makeDefaultValidation(addSurveyMapperValidator)
    validations.push(new AddSurveyModelValidator())
    expect(ValidationComposite).toHaveBeenLastCalledWith(validations)
  })
})
