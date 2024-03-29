import { AddSurveySubFielsValidator } from './add-survey-subfiles-validator'
import { MissingParamError, TypeParamError } from '@/presentation/errors'

const makeSut = (): AddSurveySubFielsValidator => {
  return new AddSurveySubFielsValidator()
}

describe('AddSurvey Validator', () => {
  test('should returns MissingParamError if "answers[X].answer" is no provided', () => {
    const sut = makeSut()
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
    const sut = makeSut()
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
    const sut = makeSut()
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
    const sut = new AddSurveySubFielsValidator()
    const surveyData = {
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
