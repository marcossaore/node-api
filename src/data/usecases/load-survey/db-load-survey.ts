import { SurveyModel, LoadSurveysRepository, LoadSurveys } from './db-load-survey-protocols'

export class DbLoadSurvey implements LoadSurveys {
  private readonly loadSurveysRepository: LoadSurveysRepository

  constructor (loadSurveyRepository: LoadSurveysRepository) {
    this.loadSurveysRepository = loadSurveyRepository
  }

  async load (): Promise<SurveyModel[]> {
    const surveys = await this.loadSurveysRepository.loadAll()
    return surveys
  }
}
