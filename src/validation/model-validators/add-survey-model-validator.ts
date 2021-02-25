import { AddSurveyModel } from '../../domain/usecases/add-survey'
import { MissingParamError, TypeParamError } from '../../presentation/errors'
import { ModelValidator } from '../../presentation/protocols'

export class AddSurveyModelValidator implements ModelValidator {
  validate (params: any): Error {
    const { question, answers }: AddSurveyModel = params as AddSurveyModel

    if (typeof question !== 'string') {
      return new TypeParamError('question', 'string')
    }

    if (!Array.isArray(answers)) {
      return new TypeParamError('answers', 'array')
    }

    for (const [index, value] of answers.entries()) {
      const answer = value.answer

      if (!answer) {
        return new MissingParamError(`answers[${index}].answer`)
      }

      if (typeof answer !== 'string') {
        return new TypeParamError(`answers[${index}].answer`, 'string')
      }

      const image = value.image

      if (image) {
        if (typeof image !== 'string') {
          return new TypeParamError(`answers[${index}].image`, 'string')
        }
      }
    }
  }
}
