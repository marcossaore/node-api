export interface UpdateAccessTokenRepository {
  updateAcessTokens: (id: string, token: string) => Promise<void>
}
