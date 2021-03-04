import { AccessDeniedError } from '../../presentation/errors'
import { forbidden } from '../../presentation/helpers/http/http-helpers'
import { Middleware, HttpRequest, HttpResponse } from '../../presentation/protocols'

export class AuthMiddleware implements Middleware {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    return forbidden(new AccessDeniedError())
  }
}
