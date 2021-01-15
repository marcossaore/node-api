import { serverError } from '../../presentation/helpers/http-helpers'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'
import { LogErrorRepository } from '../../data/protocols/log-error-repository'

const makeController = (): Controller => {
  class ControlerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = {
        body: 'any_data',
        statusCode: 200
      }
      return Promise.resolve(httpResponse)
    }
  }
  return new ControlerStub()
}

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async log (stack: string): Promise<void> {
      await Promise.resolve(null)
    }
  }

  return new LogErrorRepositoryStub()
}
interface SutTypes {
  controllerStub: Controller
  sut: LogControllerDecorator
  logErrorRepository: LogErrorRepository
}

const makeSut = (): SutTypes => {
  const controllerStub = makeController()
  const logErrorRepository = makeLogErrorRepository()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepository)
  return {
    controllerStub,
    sut,
    logErrorRepository
  }
}

describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const httpRequest: HttpRequest = {
      body: 'any_data'
    }
    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  test('Should return the same result of the controller', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = {
      body: 'any_data'
    }
    const httpResponse: HttpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual({
      body: 'any_data',
      statusCode: 200
    })
  })

  test('Shoud call LogErrorRepository logError with correct error if controller returns a server error', async () => {
    const { sut, logErrorRepository, controllerStub } = makeSut()
    const fakeError = new Error()
    fakeError.stack = 'stack_error'
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(Promise.resolve(serverError(fakeError)))
    const logErrorSpy = jest.spyOn(logErrorRepository, 'log')
    const httpRequest: HttpRequest = {
      body: 'any_data'
    }
    await sut.handle(httpRequest)
    expect(logErrorSpy).toHaveBeenCalledWith('stack_error')
  })
})
