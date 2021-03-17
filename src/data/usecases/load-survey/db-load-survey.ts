import { SurveyModel, LoadSurveyRepository } from './db-load-survey-protocols'
import { LoadSurvey } from '../../../domain/usecases/load-survey'

export class DbLoadSurvey implements LoadSurvey {
  private readonly loadSurveyRepository: LoadSurveyRepository

  constructor (loadSurveyRepository: LoadSurveyRepository) {
    this.loadSurveyRepository = loadSurveyRepository
  }

  async load (): Promise<SurveyModel[]> {
    await this.loadSurveyRepository.loadAll()
    return null
  }
}
