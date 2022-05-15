export interface AccessTokenPayload {
  iss: string,
  sub: string,
  aud: string,
}

export interface IdTokenPayload {
  iss: string,
  sub: string,
  aud: string,
  userinfo: {
    email: string,
    given_name: string,
    family_name: string,
    username: string,
    organizationId: string,
    createdAt: Date,
  }
}