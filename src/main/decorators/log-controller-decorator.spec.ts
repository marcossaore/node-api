import { LogErrorRepository } from '@/data/protocols/db/log/log-error-repository'
import { mockLogErrorRepository } from '@/data/test'
import { serverError, ok } from '@/presentation/helpers/http/http-helpers'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { LogControllerDecorator } from './log-controller-decorator'

const makeController = (): Controller => {
  class ControlerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return Promise.resolve(ok(makeFakeResponse()))
    }
  }
  return new ControlerStub()
}

const mockRequest = (): HttpRequest => ({
  body: {
    key: 'value'
  }
})

const makeFakeResponse = (): HttpResponse => ({
  body: 'any_data',
  statusCode: 200
})

const makeFakeServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'stack_error'
  return serverError(fakeError)
}
type SutTypes = {
  controllerStub: Controller
  sut: LogControllerDecorator
  logErrorRepository: LogErrorRepository
}

const makeSut = (): SutTypes => {
  const controllerStub = makeController()
  const logErrorRepository = mockLogErrorRepository()
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
    await sut.handle(mockRequest())
    expect(handleSpy).toHaveBeenCalledWith(mockRequest())
  })

  test('Should return the same result of the controller', async () => {
    const { sut } = makeSut()
    const httpResponse: HttpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(makeFakeResponse()))
  })

  test('Shoud call LogErrorRepository logError with correct error if controller returns a server error', async () => {
    const { sut, logErrorRepository, controllerStub } = makeSut()

    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(Promise.resolve(makeFakeServerError()))
    const logErrorSpy = jest.spyOn(logErrorRepository, 'logError')
    await sut.handle(mockRequest())
    expect(logErrorSpy).toHaveBeenCalledWith('stack_error')
  })
})
