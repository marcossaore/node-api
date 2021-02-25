import { AddSurveyModelValidator } from './add-survey-model-validator'
import { TypeParamError } from '../../presentation/errors'

describe('AddSurvey Validator', () => {
  test('should returns TypeErrorParam if "answers" to be invalid in model', () => {
    const sut = new AddSurveyModelValidator()
    const surveyDateWithoutAnswers = {
      question: 'Any question',
      answers: null
    }
    const error = sut.validate(surveyDateWithoutAnswers)
    expect(error).toEqual(new TypeParamError('answers', 'array'))
  })
})
