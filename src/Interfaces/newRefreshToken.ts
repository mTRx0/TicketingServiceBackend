export interface newRefreshToken {
  userId: string,
  tokenFamilyId: string,
  usedInFamily: boolean,
  refreshToken: string,
  validUntil: Date
}