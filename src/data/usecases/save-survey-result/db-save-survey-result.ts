import { SaveSurveyResult, SaveSurveyResultRepository, SurveyVote, SurveyResultModel } from './db-save-survey-result-protocols'

export class DbSaveSurveyResult implements SaveSurveyResult {
  private readonly saveSurveyResultRepository: SaveSurveyResultRepository

  constructor (saveSurveyResultRepository: SaveSurveyResultRepository) {
    this.saveSurveyResultRepository = saveSurveyResultRepository
  }

  async save (surveyVote: SurveyVote): Promise<SurveyResultModel> {
    const surveyResult = await this.saveSurveyResultRepository.save(surveyVote)
    return surveyResult
  }
}
