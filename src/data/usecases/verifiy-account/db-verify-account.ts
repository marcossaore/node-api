import { VerifyExistedAccount } from '../../../domain/usecases/verify-existed-account'
import { VerifyExistedAccountRepository } from '../../protocols/db/verify-existed-account-repository'

export class DbVerifyAccount implements VerifyExistedAccount {
  private readonly verifyExistedAccountRepository: VerifyExistedAccountRepository

  constructor (verifyExistedAccountRepository: VerifyExistedAccountRepository) {
    this.verifyExistedAccountRepository = verifyExistedAccountRepository
  }

  async verify (email: string): Promise<boolean> {
    await this.verifyExistedAccountRepository.verify(email)
    return null
  }
}
