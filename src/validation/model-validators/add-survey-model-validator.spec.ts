import { AddSurveyModelValidator } from './add-survey-model-validator'
import { MissingParamError, TypeParamError } from '../../presentation/errors'

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

  test('should returns MissingParamError if "answers[X].answer" is no provided', () => {
    const sut = new AddSurveyModelValidator()
    const surveyDataWithoutParamsInQuestion = {
      question: 'Any question',
      answers: [
        {
          answer: 'any_answer'
        },
        {
        }
      ]
    }
    const error = sut.validate(surveyDataWithoutParamsInQuestion)
    expect(error).toEqual(new MissingParamError('answers[1].answer'))
  })
})
