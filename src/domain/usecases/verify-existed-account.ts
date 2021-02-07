export interface VerifyExistedAccount {
  verify: (email: string) => Promise<boolean>
}
