
import { AddSurveyModel } from 'domain/usecases/add-survey'
import { AddSurveyRepository } from '../../../../data/protocols/db/survey/add-survey-repository'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository {
  async add (data: AddSurveyModel): Promise<void> {
    const surveys = await MongoHelper.getCollection('surveys')
    const { question, answers } = data
    await surveys.insertOne({
      question,
      answers
    })
  }
}
