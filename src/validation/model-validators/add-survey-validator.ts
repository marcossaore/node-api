import { AddSurveyModel } from '../../domain/usecases/add-survey'
import { TypeParamError } from '../../presentation/errors'
import { ModelValidator } from '../../presentation/protocols'

export class AddSurveyValidator implements ModelValidator {
  validate (params: any): Error {
    const { answers }: AddSurveyModel = params as AddSurveyModel

    if (!Array.isArray(answers)) {
      return new TypeParamError('answers', 'array')
    }

    return null
  }
}
