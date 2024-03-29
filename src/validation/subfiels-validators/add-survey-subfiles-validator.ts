import { AddSurveyParams } from '@/domain/usecases/survey/add-survey'
import { MissingParamError, TypeParamError } from '@/presentation/errors'
import { Validation } from '@/presentation/protocols'

export class AddSurveySubFielsValidator implements Validation {
  validate (params: any): Error {
    const { answers }: AddSurveyParams = params as AddSurveyParams

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
