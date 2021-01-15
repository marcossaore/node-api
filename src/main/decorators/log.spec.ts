import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

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
interface SutTypes {
  controllerStub: Controller
  sut: LogControllerDecorator
}

const makeSut = (): SutTypes => {
  const controllerStub = makeController()
  const sut = new LogControllerDecorator(controllerStub)
  return {
    controllerStub,
    sut
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
})

/**
 * a - create a fakecontroller using a muck http-response
 * b - pass the fakecontroller as dependency injection to the LogControllerDecorator
 * c - create a fakeHttpRequest to pass as parameter to the handle method
 */

/**
  * 1 - spy handle method of fakecontroller and ensure that it invokes with the same parameter of fakeHttpRequest
  * 2 - verify if handle method of LogControllerDecorator returns the same muck http-response
  */
