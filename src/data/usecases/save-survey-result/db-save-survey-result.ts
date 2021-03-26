import { SaveSurveyResult, SaveSurveyResultRepository, SaveSurveyResultParams, SurveyResultModel } from './db-save-survey-result-protocols'

export class DbSaveSurveyResult implements SaveSurveyResult {
  private readonly saveSurveyResultRepository: SaveSurveyResultRepository

  constructor (saveSurveyResultRepository: SaveSurveyResultRepository) {
    this.saveSurveyResultRepository = saveSurveyResultRepository
  }

  async save (saveSurveyResultParams: SaveSurveyResultParams): Promise<SurveyResultModel> {
    const surveyResult = await this.saveSurveyResultRepository.save(saveSurveyResultParams)
    return surveyResult
  }
}
