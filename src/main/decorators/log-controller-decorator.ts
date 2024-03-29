import { LogErrorRepository } from '@/data/protocols/db/log/log-error-repository'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class LogControllerDecorator implements Controller {
  private readonly controller: Controller
  private readonly logErrorRepository: LogErrorRepository

  constructor (controller: Controller, logErrorRepository: LogErrorRepository) {
    this.controller = controller
    this.logErrorRepository = logErrorRepository
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse: HttpResponse = await this.controller.handle(httpRequest)

    if (httpResponse.statusCode === 500) {
      const stack = httpResponse.body.stack
      await this.logErrorRepository.logError(stack)
    }
    return httpResponse
  }
}
