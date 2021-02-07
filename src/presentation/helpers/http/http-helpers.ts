import { ServerError, UnauthorizedError, ConflictError } from '../../errors'
import { HttpResponse } from '../../protocols/http'

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const unauthorized = (): HttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError()
})

export const conflict = (message: string): HttpResponse => ({
  statusCode: 409,
  body: new ConflictError(message)
})

export const ok = (body: any): HttpResponse => ({
  statusCode: 200,
  body: body
})

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack)
})
