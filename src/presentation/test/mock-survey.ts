import { SurveyModel } from '@/domain/models/survey'
import { mockSurveyModel } from '@/domain/test'
import { AddSurvey, AddSurveyParams } from '@/domain/usecases/survey/add-survey'
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import { LoadSurveys } from '@/domain/usecases/survey/load-surveys'

export const mockAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add (data: AddSurveyParams): Promise<void> {

    }
  }
  return new AddSurveyStub()
}

export const mockLoadSurvey = (): LoadSurveys => {
  class LoadSurveyStub implements LoadSurveys {
    async load (): Promise<SurveyModel[]> {
      return [mockSurveyModel()]
    }
  }
  return new LoadSurveyStub()
}

export const mockLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async load (id: string): Promise<SurveyModel> {
      return mockSurveyModel()
    }
  }

  return new LoadSurveyByIdStub()
}
