import { AddSurveyParams } from '@/data/usecases/add-survey/db-add-survey-protocols'
import { SurveyModel } from '@/data/usecases/load-survey/db-load-survey-protocols'

export const mockAddSurveyParams = (): AddSurveyParams => ({
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer'
    },
    {
      answer: 'any_answer'
    }
  ],
  date: new Date()
})

export const mockSurveyModel = (): SurveyModel => {
  return {
    id: 'any_id',
    question: 'any_question',
    answers: [
      {
        answer: 'any_answer'
      }
    ],
    date: new Date()
  }
}
