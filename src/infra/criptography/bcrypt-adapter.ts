import { Encrypter } from '../../data/protocols/criptography/encrypter'
import bcrypt = require('bcrypt')

export class BcryptAdapter implements Encrypter {
  private readonly salt: number

  constructor (salt: number) {
    this.salt = salt
  }

  async encrypt (value: string): Promise<string> {
    const hashed = bcrypt.hash(value, this.salt)
    return hashed
  }
}
