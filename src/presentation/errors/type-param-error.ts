export class TypeParamError extends Error {
  constructor (paramName: string, expected: string) {
    super(`Type param: "${paramName}" expected "${expected}" type`)
    this.name = 'TypeParamError'
  }
}
