import { Encrypter } from '@/data/protocols/criptography/encrypter'
import { Decrypter } from 'data/protocols/criptography/decrypter'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements Encrypter, Decrypter {
  private readonly secret: string

  constructor (secret: string) {
    this.secret = secret
  }

  async encrypt (value: string): Promise<string> {
    const accessToken: string = await jwt.sign({ id: value }, this.secret)
    return accessToken
  }

  async decrypt (token: string): Promise<string> {
    try {
      const value: any = await jwt.verify(token, this.secret)
      return value
    } catch (error) {
      return null
    }
  }
}
