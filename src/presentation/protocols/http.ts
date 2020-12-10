export interface HttpResponse {
  statusCode: number
  body: any
}

export interface HttpRequest {
  // if request is GET body is optional
  body?: any
}
