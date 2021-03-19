export type SurveyResultAnswer = {
  answer: string
  votes: Number
}

export type SurveyResultModel = {
  id: string
  questionId: string
  answers: SurveyResultAnswer[]
}
