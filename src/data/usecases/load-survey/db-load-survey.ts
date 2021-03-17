import { SurveyModel, LoadSurveyRepository, LoadSurvey } from './db-load-survey-protocols'

export class DbLoadSurvey implements LoadSurvey {
  private readonly loadSurveyRepository: LoadSurveyRepository

  constructor (loadSurveyRepository: LoadSurveyRepository) {
    this.loadSurveyRepository = loadSurveyRepository
  }

  async load (): Promise<SurveyModel[]> {
    const surveys = await this.loadSurveyRepository.loadAll()
    return surveys
  }
}
