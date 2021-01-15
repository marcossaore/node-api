import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
    class ControlerStub implements Controller {
      async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        const httpResponse: HttpResponse = {
          body: 'any_data',
          statusCode: 200
        }
        return Promise.resolve(httpResponse)
      }
    }

    const controllerStub = new ControlerStub()
    const handleSpy = jest.spyOn(controllerStub, 'handle')

    const sut = new LogControllerDecorator(controllerStub)

    const httpRequest: HttpRequest = {
      body: 'any_data'
    }

    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
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
