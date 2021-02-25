import { AddSurveyModel } from '../../domain/usecases/add-survey'
import { MissingParamError, TypeParamError } from '../../presentation/errors'
import { ModelValidator } from '../../presentation/protocols'

export class AddSurveyModelValidator implements ModelValidator {
  validate (params: any): Error {
    const { answers }: AddSurveyModel = params as AddSurveyModel

    if (!Array.isArray(answers)) {
      return new TypeParamError('answers', 'array')
    }

    for (const [index, value] of answers.entries()) {
      const answer = value.answer
      if (!answer) {
        return new MissingParamError(`answers[${index}].answer`)
      }
    }
  }
}
