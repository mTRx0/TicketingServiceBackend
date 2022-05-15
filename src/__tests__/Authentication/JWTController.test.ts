import { AuthToken } from "@prisma/client";
import { JWTController } from "../../Authentication/JWTAuthenticationController";
import { ErrorName } from "../../ErrorHandling/ErrorType";
import { prismaMock } from '../../prismaMock';

describe('Test the JWTAuthenticationController Class', () => {
  it('should return AuthResponse object containing all tokens', async () => {
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

    const mockAuthToken: AuthToken = {
      id: '0afc730c-dc6b-47eb-a1f5-9c0a360ad919',
      userId: '0afc730c-dc6b-47eb-a1f5-9c0a360ad920',
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJUaWNrZXRpbmdTZXJ2aWNlIiwic3ViIjoiMGFmYzczMGMtZGM2Yi00N2ViLWExZjUtOWMwYTM2MGFkOTIwIiwiYXVkIjoiVGlja2V0aW5nU2VydmljZS5XZWJDbGllbnQiLCJpYXQiOjE2NTI1NjU2MzIsImV4cCI6MTY1MjU2OTIzMn0.zHAOyiYSY98EFPSFGSW_RYnV3pIyZWGRktXIDt9D2Bc',
      refreshToken: 'faa6dbf40be85f6e5a5622a152f491c67c399bed934814fc78d4924f89a8d2d5c8f427681b626081037c639b5a5294762c1eb7fcc3beb8b5f68a21ab56d0796ffc0a0982e3a7ab29521a9c6f090b5fa32481681af1e97fd327a992d613d35d44e2fd78aaae9e05d04d98448bd341d8170cf44e895172f8ec31599df5dabc8147'
    }

    prismaMock.authToken.create.mockResolvedValue(mockAuthToken)

    const jwtAuthController = new JWTController();
    const authResponse = await jwtAuthController.getAuthResponse(mockedUserObject);

    expect(authResponse).toEqual(expect.objectContaining({
      accessToken: expect.any(String),
      idToken: expect.any(String),
      refreshToken: expect.any(String)
    }))

    for (const [, value] of Object.entries(authResponse)) {
      expect(value).toBeTruthy();
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

    const jwtAuthController = new JWTController();

    await expect(jwtAuthController.getAuthResponse(mockedUserObject))
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

    const jwtAuthController = new JWTController();

    await expect(jwtAuthController.getAuthResponse(mockedUserObject))
    .rejects
    .toThrow(ErrorName.INVALID_ARGUMENTS);
  });
});