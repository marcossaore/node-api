import { AccessDeniedError } from '../../presentation/errors'
import { forbidden, ok, serverError } from '../../presentation/helpers/http/http-helpers'
import { LoadAccountByToken, Middleware, HttpRequest, HttpResponse } from './auth-middleware-protocols'
export class AuthMiddleware implements Middleware {
  private readonly loadAccountByToken: LoadAccountByToken
  private readonly role: string

  constructor (loadAccountByToken: LoadAccountByToken, role: string) {
    this.loadAccountByToken = loadAccountByToken
    this.role = role
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.headers?.['x-access-token']
      if (accessToken) {
        const account = await this.loadAccountByToken.load(accessToken, this.role)
        if (account) {
          return ok({ accountId: account.id })
        }
      }
      return forbidden(new AccessDeniedError())
    } catch (error) {
      return serverError(error)
    }
  }
}
