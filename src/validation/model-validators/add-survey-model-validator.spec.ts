import { AddSurveyModelValidator } from './add-survey-model-validator'
import { MissingParamError, TypeParamError } from '../../presentation/errors'
import { AddSurveyModel } from '../../domain/usecases/add-survey'

describe('AddSurvey Validator', () => {
  test('should returns TypeErrorParam if "question" to be invalid in model', () => {
    const sut = new AddSurveyModelValidator()
    const surveyDateWithoutAnswers = {
      question: [],
      answers: null
    }
    const error = sut.validate(surveyDateWithoutAnswers)
    expect(error).toEqual(new TypeParamError('question', 'string'))
  })

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

  test('should returns TypeErrorParam if "answers[X].answer" has an invalid type', () => {
    const sut = new AddSurveyModelValidator()
    const surveyDataWithInvalidParamsInQuestion = {
      question: 'Any question',
      answers: [
        {
          answer: 'any_answer'
        },
        {
          answer: {
            data: 'any_data'
          }
        }
      ]
    }
    const error = sut.validate(surveyDataWithInvalidParamsInQuestion)
    expect(error).toEqual(new TypeParamError('answers[1].answer', 'string'))
  })

  test('should returns TypeErrorParam if "answers[X].image" has an invalid type', () => {
    const sut = new AddSurveyModelValidator()
    const surveyDataWithInvalidImage = {
      question: 'Any question',
      answers: [
        {
          answer: 'any_answer',
          image: []
        },
        {
          answer: 'any_answer'
        }
      ]
    }
    const error = sut.validate(surveyDataWithInvalidImage)
    expect(error).toEqual(new TypeParamError('answers[0].image', 'string'))
  })

  test('should not return on success', () => {
    const sut = new AddSurveyModelValidator()
    const surveyData: AddSurveyModel = {
      question: 'Any question',
      answers: [
        {
          answer: 'any_answer',
          image: 'any_image'
        },
        {
          answer: 'any_answer'
        }
      ]
    }
    const error = sut.validate(surveyData)
    expect(error).toBeFalsy()
  })
})
