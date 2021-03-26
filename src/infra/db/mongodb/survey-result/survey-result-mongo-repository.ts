import { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResultRepository } from '@/data/usecases/save-survey-result/db-save-survey-result-protocols'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save (saveSurveyResultParams: SaveSurveyResultParams): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    const { surveyId, accountId, answer, date } = saveSurveyResultParams
    const surveyResult = await surveyResultCollection.findOneAndUpdate(
      {
        surveyId,
        accountId
      },
      {
        $set: {
          answer,
          date
        }
      },
      {
        upsert: true,
        returnOriginal: false
      }
    )
    return MongoHelper.map(surveyResult.value)
  }
}
