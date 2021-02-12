export class EmailInUseError extends Error {
  constructor () {
    super('this email is already in use')
    this.name = 'EmailInUseError'
  }
}
