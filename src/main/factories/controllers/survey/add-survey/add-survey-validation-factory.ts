import { ValidationComposite } from '@/validation/validators'
import { Validation } from '@/presentation/protocols'
import { AddSurveySubFielsValidator } from '@/validation/subfiels-validators/add-survey-subfiles-validator'
import { MapperModelValidator } from '@/presentation/protocols/mapper-model-validator'
import { makeDefaultValidation } from '@/main/factories/validations/default-validator-factory'

export const makeAddSurveyValidation = (): Validation => {
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
  validations.push(new AddSurveySubFielsValidator())

  return new ValidationComposite(validations)
}
