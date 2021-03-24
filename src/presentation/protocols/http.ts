export interface HttpResponse {
  statusCode: number
  body: any
}

export interface HttpRequest {
  body?: any
  headers?: any
  parameters?: any
  data?: any
}
