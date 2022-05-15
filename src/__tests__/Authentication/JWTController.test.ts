import { RefreshToken } from "@prisma/client";
import { JWTController } from "../../Authentication/JWTController";
import { DatabaseController } from "../../Database/DatabaseController";
import { ErrorName } from "../../ErrorHandling/ErrorType";

describe('Test the JWTAuthenticationController Class', () => {
  let jwtController: JWTController

  beforeEach(() => {
    jwtController = new JWTController();
  })

  it('should return IdAuthResponse object containing all tokens', async () => {
    const mockedUserObject = {
      id: '0afc730c-dc6b-47eb-a1f5-9c0a360ad920',
      email: 'testEmail@email.com',
      given_name: 'Test',
      family_name: 'Name',
      username: 'testUsername',
      password: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
      inviteCodeUsedId: '0afc730c-dc6b-47eb-a1f5-9c0a360ad923',
      organizationId: '0afc730c-dc6b-47eb-a1f5-9c0a360ad921',
      isOrganizationManager: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const authResponse = await jwtController.getIdAuthResponse(mockedUserObject);

    expect(authResponse).toEqual(expect.objectContaining({
      accessToken: expect.any(String),
      idToken: expect.any(String),
      refreshToken: expect.any(String)
    }))

    for (const [, value] of Object.entries(authResponse)) {
      expect(value).toBeTruthy();
    }
  })

  it('should return AuthResponse object containing access token and refresh token', async () => {
    const mockedUserObject = {
      id: '0afc730c-dc6b-47eb-a1f5-9c0a360ad920',
      email: 'testEmail@email.com',
      given_name: 'Test',
      family_name: 'Name',
      username: 'testUsername',
      password: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
      inviteCodeUsedId: '0afc730c-dc6b-47eb-a1f5-9c0a360ad923',
      organizationId: '0afc730c-dc6b-47eb-a1f5-9c0a360ad921',
      isOrganizationManager: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const authResponse = await jwtController.getAuthResponse(mockedUserObject);

    expect(authResponse).toEqual(expect.objectContaining({
      accessToken: expect.any(String),
      refreshToken: expect.any(String)
    }))

    for (const [, value] of Object.entries(authResponse)) {
      expect(value).toBeTruthy();
    }
  })

  it('should return AuthResponse object containing new access token and refresh token for provided refresh token', async () => {
    const mockedRefreshToken = ''
    const mockRefreshToken: RefreshToken = {
      id: '0afc730c-dc6b-47eb-a1f5-9c0a360ad980',
      userId: '0afc730c-dc6b-47eb-a1f5-9c0a360ad920',
      tokenFamilyId: '0afc730c-dc6b-47eb-a1f5-9c0a360ad990',
      usedInFamily: false,
      refreshToken: '',
      validUntil: new Date(Date.now() + 1000 /*sec*/ * 60 /*min*/ * 60 /*hour*/ * 7 /*day*/)
    }

    jest.spyOn(DatabaseController.prototype, 'retrieveRefreshTokenData').mockResolvedValue(mockRefreshToken);
    jest.spyOn(DatabaseController.prototype, 'storeNewRefreshToken').mockResolvedValue(mockRefreshToken);
    const authResponse = await jwtController.refresh(mockedRefreshToken)

    expect(authResponse).toEqual(expect.objectContaining({
      accessToken: expect.any(String),
      refreshToken: expect.any(String)
    }))

    for (const [, value] of Object.entries(authResponse)) {
      expect(value).toBeTruthy();
    }
  })

  it('should delete all refresh tokens in token family if provided refresh token has been used before', async () => {
    const mockedRefreshToken = ''
    const mockRefreshToken: RefreshToken = {
      id: '0afc730c-dc6b-47eb-a1f5-9c0a360ad980',
      userId: '0afc730c-dc6b-47eb-a1f5-9c0a360ad920',
      tokenFamilyId: '0afc730c-dc6b-47eb-a1f5-9c0a360ad990',
      usedInFamily: true,
      refreshToken: '',
      validUntil: new Date(Date.now() + 1000 /*sec*/ * 60 /*min*/ * 60 /*hour*/ * 7 /*day*/)
    }

    jest.spyOn(DatabaseController.prototype, 'retrieveRefreshTokenData').mockResolvedValue(mockRefreshToken);
    const deleteRefreshTokenFamilySpy = jest.spyOn(DatabaseController.prototype, 'deleteRefreshTokenFamily')

    try {
      await jwtController.refresh(mockedRefreshToken)
    } catch (e) {
      expect(e).toEqual(Error(ErrorName.INVALID_REFRESH_TOKEN))
      expect(deleteRefreshTokenFamilySpy).toHaveBeenCalled();
    }
  })

  it('should throw error when email is provided in wrong format', async () => {
    const mockedUserObject = {
      id: '0afc730c-dc6b-47eb-a1f5-9c0a360ad920',
      email: 'testEmailemail.com',
      given_name: 'Test',
      family_name: 'Name',
      username: 'testUsername',
      password: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
      inviteCodeUsedId: '0afc730c-dc6b-47eb-a1f5-9c0a360ad923',
      organizationId: '0afc730c-dc6b-47eb-a1f5-9c0a360ad921',
      isOrganizationManager: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    await expect(jwtController.getAuthResponse(mockedUserObject))
    .rejects
    .toThrow(ErrorName.INVALID_ARGUMENTS);
  });

  it('should throw error when password is provided in wrong format', async () => {
    const mockedUserObject = {
      id: '0afc730c-dc6b-47eb-a1f5-9c0a360ad920',
      email: 'testEmail@email.com',
      given_name: 'Test',
      family_name: 'Name',
      username: 'testUsername',
      password: 'testPassword',
      inviteCodeUsedId: '0afc730c-dc6b-47eb-a1f5-9c0a360ad923',
      organizationId: '0afc730c-dc6b-47eb-a1f5-9c0a360ad921',
      isOrganizationManager: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    await expect(jwtController.getAuthResponse(mockedUserObject))
    .rejects
    .toThrow(ErrorName.INVALID_ARGUMENTS);
  });
});