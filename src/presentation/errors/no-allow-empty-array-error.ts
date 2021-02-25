export class NoAllowEmptyArrayError extends Error {
  constructor (paramName: string) {
    super(`NoAllowEmptyArrayError: ${paramName} can't be empty`)
    this.name = 'NoAllowEmptyArrayError'
  }
}
