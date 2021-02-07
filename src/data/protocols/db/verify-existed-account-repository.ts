import { AccountModel } from '../../../domain/models/account'

export interface VerifyExistedAccountRepository {
  verify: (email: string) => Promise<AccountModel>
}
