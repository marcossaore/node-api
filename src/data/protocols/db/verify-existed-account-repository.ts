export interface VerifyExistedAccountRepository {
  verify: (argument: string) => Promise<boolean>
}
