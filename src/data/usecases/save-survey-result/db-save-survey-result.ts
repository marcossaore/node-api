import { SaveSurveyResult, SaveSurveyResultRepository, SurveyResult, SurveyResultModel } from './db-save-survey-result-protocols'

export class DbSaveSurveyResult implements SaveSurveyResult {
  private readonly saveSurveyResultRepository: SaveSurveyResultRepository

  constructor (saveSurveyResultRepository: SaveSurveyResultRepository) {
    this.saveSurveyResultRepository = saveSurveyResultRepository
  }

  async save (surveyResult: SurveyResult): Promise<SurveyResultModel> {
    await this.saveSurveyResultRepository.save(surveyResult)
    return null
  }
}
