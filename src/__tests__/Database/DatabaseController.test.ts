import { RefreshToken, User } from "@prisma/client";
import { PrismaClientValidationError } from "@prisma/client/runtime";
import { DatabaseController } from "../../Database/DatabaseController";
import { ErrorName } from "../../ErrorHandling/ErrorType";
import { IdAuthResponse } from "../../Interfaces/AuthResponse";
import { prismaMock } from "../../prismaMock";

describe('Test the DatabaseController Class', () => {
  it('should register new user to database', async () => {
    const mockedDate = new Date();
    const mockUser: User = {
      id: '0afc730c-dc6b-47eb-a1f5-9c0a360ad920',
      email: 'testEmail@email.com',
      given_name: 'Test',
      family_name: 'Name',
      username: 'testUsername',
      password: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
      inviteCodeUsedId: '0afc730c-dc6b-47eb-a1f5-9c0a360ad923',
      organizationId: '0afc730c-dc6b-47eb-a1f5-9c0a360ad921',
      isOrganizationManager: false,
      createdAt: mockedDate,
      updatedAt: mockedDate
    }

    const mockAuthResponse: IdAuthResponse = {
      accessToken: '',
      idToken: '',
      refreshToken: ''
    }

    prismaMock.$transaction.mockResolvedValue(null)

    const dbController = new DatabaseController();

    expect(await dbController.registerUser(mockUser, mockAuthResponse)).toBe(null)
  })

  it('should sync existing user to database when logging in', async () => {
    const mockUser = {
      id: '0afc730c-dc6b-47eb-a1f5-9c0a360ad920',
    }

    const mockAuthResponse: IdAuthResponse = {
      accessToken: '',
      idToken: '',
      refreshToken: ''
    }

    prismaMock.$transaction.mockResolvedValue(null)

    const dbController = new DatabaseController();

    expect(dbController.loginUser(mockUser.id, mockAuthResponse))
    .resolves
    .not
    .toThrowError();
  })

  it('should throw error if database sync is unsuccessful when logging in', async () => {
    const mockUser = {
      id: '0afc730c-dc6b-47eb-a1f5-9c0a360ad920',
    }

    const mockAuthResponse: IdAuthResponse = {
      accessToken: '',
      idToken: '',
      refreshToken: ''
    }

    prismaMock.$transaction.mockRejectedValue(null);

    const dbController = new DatabaseController();

    expect(dbController.loginUser(mockUser.id, mockAuthResponse))
    .rejects
    .toThrowError();
  })

  it('should log user out', async () => {
    const mockRefreshToken: RefreshToken = {
      id: '0afc730c-dc6b-47eb-a1f5-9c0a360ad980',
      userId: '0afc730c-dc6b-47eb-a1f5-9c0a360ad920',
      tokenFamilyId: '0afc730c-dc6b-47eb-a1f5-9c0a360ad990',
      usedInFamily: false,
      refreshToken: '',
      validUntil: new Date(Date.now() + 1000 /*sec*/ * 60 /*min*/ * 60 /*hour*/ * 7 /*day*/)
    }

    prismaMock.refreshToken.findUnique.mockResolvedValue(mockRefreshToken);

    const dbController = new DatabaseController();

    expect(dbController.logoutUser(''))
    .resolves
    .not
    .toThrowError();
  })

  it('should throw error if database sync is unsuccessful when logging out', async () => {
    prismaMock.refreshToken.findUnique.mockRejectedValue(null);

    const dbController = new DatabaseController();

    expect(dbController.logoutUser(''))
    .rejects
    .toThrowError();
  })

  it('should throw error with malformed data provided', () => {
    const mockedDate = new Date();
    const mockUser: User = {
      id: '0afc730c-dc6b-47eb-a1f5-9c0a360ad920',
      email: 'testEmail@email.com',
      given_name: 'Test',
      family_name: 'Name',
      username: 'testUsername',
      password: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
      inviteCodeUsedId: '0afc730c-dc6b-47eb-a1f5-9c0a360ad923',
      organizationId: '0afc730c-dc6b-47eb-a1f5-9c0a360ad921',
      isOrganizationManager: false,
      createdAt: mockedDate,
      updatedAt: mockedDate
    }

    const mockAuthResponse: IdAuthResponse = {
      accessToken: '',
      idToken: '',
      refreshToken: ''
    }

    prismaMock.$transaction.mockRejectedValue(new PrismaClientValidationError(` The provided value for the column is too long for the column's type. Column: accessToken `))

    const dbController = new DatabaseController();

    expect(dbController.registerUser(mockUser, mockAuthResponse))
    .rejects
    .toThrow(ErrorName.SERVER_ERROR);
  })

  it('should delete expired refresh tokens', async () => {
    prismaMock.$transaction.mockResolvedValue(null)

    const dbController = new DatabaseController();
    expect(dbController.deleteExpiredRefreshTokens())
    .resolves
    .not
    .toThrowError()
  });

  it('should retrieve refresh token data', async () => {
    const mockRefreshToken: RefreshToken = {
      id: '0afc730c-dc6b-47eb-a1f5-9c0a360ad980',
      userId: '0afc730c-dc6b-47eb-a1f5-9c0a360ad920',
      tokenFamilyId: '0afc730c-dc6b-47eb-a1f5-9c0a360ad990',
      usedInFamily: false,
      refreshToken: '',
      validUntil: new Date(Date.now() + 1000 /*sec*/ * 60 /*min*/ * 60 /*hour*/ * 7 /*day*/)
    }

    prismaMock.refreshToken.findUnique.mockResolvedValue(mockRefreshToken);

    const dbController = new DatabaseController();
    expect(dbController.retrieveRefreshTokenData(mockRefreshToken.refreshToken))
    .resolves
    .toEqual(mockRefreshToken)
  });

  it('should retrieve refresh token family', async () => {
    const mockRefreshToken: RefreshToken = {
      id: '0afc730c-dc6b-47eb-a1f5-9c0a360ad980',
      userId: '0afc730c-dc6b-47eb-a1f5-9c0a360ad920',
      tokenFamilyId: '0afc730c-dc6b-47eb-a1f5-9c0a360ad990',
      usedInFamily: false,
      refreshToken: '',
      validUntil: new Date(Date.now() + 1000 /*sec*/ * 60 /*min*/ * 60 /*hour*/ * 7 /*day*/)
    }

    prismaMock.refreshToken.findMany.mockResolvedValue([mockRefreshToken])

    const dbController = new DatabaseController();
    expect(dbController.retrieveRefreshTokenFamily(mockRefreshToken.tokenFamilyId))
    .resolves
    .toEqual([mockRefreshToken])
  });

  it('should store updated refresh token', async () => {
    const mockRefreshToken: RefreshToken = {
      id: '0afc730c-dc6b-47eb-a1f5-9c0a360ad980',
      userId: '0afc730c-dc6b-47eb-a1f5-9c0a360ad920',
      tokenFamilyId: '0afc730c-dc6b-47eb-a1f5-9c0a360ad990',
      usedInFamily: false,
      refreshToken: '',
      validUntil: new Date(Date.now() + 1000 /*sec*/ * 60 /*min*/ * 60 /*hour*/ * 7 /*day*/)
    }

    prismaMock.$transaction.mockResolvedValue(mockRefreshToken)

    const dbController = new DatabaseController();
    expect(dbController.storeNewRefreshToken(mockRefreshToken))
    .resolves
    .toEqual(mockRefreshToken)
  });
});