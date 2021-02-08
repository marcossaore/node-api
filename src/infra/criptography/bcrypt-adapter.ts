import { Hasher } from '../../data/protocols/criptography/hasher'
import bcrypt = require('bcrypt')

export class BcryptAdapter implements Hasher {
  private readonly salt: number

  constructor (salt: number) {
    this.salt = salt
  }

  async hash (value: string): Promise<string> {
    const hashed = bcrypt.hash(value, this.salt)
    return hashed
  }
}
