import { AddSurveyParams, AddSurveyRepository } from '@/data/usecases/add-survey/db-add-survey-protocols'
import { mockSurveyModel } from '@/domain/test'
import { LoadSurveyByIdRepository } from '../usecases/load-survey-by-id/db-load-survey-by-id-protocols'
import { LoadSurveysRepository, SurveyModel } from '../usecases/load-survey/db-load-survey-protocols'

export const mockAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (data: AddSurveyParams): Promise<void> {

    }
  }

  return new AddSurveyRepositoryStub()
}

export const mockLoadSurveyRepository = (): LoadSurveysRepository => {
  class LoadSurveyRepositoryStub implements LoadSurveysRepository {
    async loadAll (): Promise<SurveyModel[]> {
      return [mockSurveyModel()]
    }
  }
  return new LoadSurveyRepositoryStub()
}

export const mockLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById (id: string): Promise<SurveyModel> {
      return mockSurveyModel()
    }
  }
  return new LoadSurveyByIdRepositoryStub()
}
