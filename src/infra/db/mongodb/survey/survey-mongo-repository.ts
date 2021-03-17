
import { AddSurveyModel } from 'domain/usecases/add-survey'
import { SurveyModel } from '../../../../domain/models/survey'
import { AddSurveyRepository } from '../../../../data/protocols/db/survey/add-survey-repository'
import { LoadSurveyRepository } from '../../../../data/protocols/db/survey/load-survey-repository'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveyRepository {
  async add (data: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const { question, answers } = data
    await surveyCollection.insertOne({
      question,
      answers
    })
  }

  async loadAll (): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const surveys = await surveyCollection.find().toArray() || null
    if (surveys.length === 0) {
      return null
    }
    return surveys.map(survey => MongoHelper.map(survey))
  }
}
