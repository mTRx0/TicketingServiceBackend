import { AuthenticationController } from '../../Authentication/AuthenticationController';
import { ErrorName } from '../../ErrorHandling/ErrorType'
import { prismaMock } from '../../prismaMock';

describe('Test the AuthenticationController Class', () => {
  it('should throw error on registration if input is provided in wrong format', async () => {
    const authController = new AuthenticationController({
      given_name: 'test',
      family_name: 'Name23',
      email: 'testEmail@email.com',
      username: 'testUsername',
      password: 'testPassword',
      inviteCode: 'testInviteCode',
    })

    await expect(authController.register())
    .rejects
    .toThrow(ErrorName.INVALID_ARGUMENTS);
  });

  it('should throw error on login if input is provided in wrong format', async () => {
    const authController = new AuthenticationController({
      email: 'testEmailemail.com',
      password: 'testPassword',
    })

    await expect(authController.login())
    .rejects
    .toThrow(ErrorName.INVALID_ARGUMENTS);
  });

  it('should throw error on login if wrong email is provided', async () => {
    const authController = new AuthenticationController({
      email: 'wrongEmail@email.com',
      password: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    })

    prismaMock.user.findUnique.mockResolvedValue(null);

    await expect(authController.login())
    .rejects
    .toThrow(ErrorName.INCORRECT_DATA);
  });

  it('should throw error on login if wrong password is provided', async () => {
    const authController = new AuthenticationController({
      email: 'testEmail@email.com',
      password: 'testPassword',
    })

    const mockedDate = new Date();
    const mockUser = {
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

    prismaMock.user.findUnique.mockResolvedValue(mockUser)

    await expect(authController.login())
    .rejects
    .toThrow(ErrorName.INVALID_ARGUMENTS);
  });

  
  it('should throw error with invalid invite code', async () => {
    const authController = new AuthenticationController({
      email: 'testEmail@email.com',
      given_name: 'Test',
      family_name: 'Name',
      username: 'testUsername',
      password: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
      inviteCode: '0000000000'
    })

    prismaMock.inviteCode.findUnique.mockResolvedValue(null)

    await expect(authController.register())
    .rejects
    .toThrow(ErrorName.INCORRECT_DATA);
  });

  it('should register new user and return it', async () => {
    const mockedDate: Date = new Date()
    const mockedInviteCodeBase = {
      id: '0afc730c-dc6b-47eb-a1f5-9c0a360ad923',
      code: '1234567890',
      createdById: '0afc730c-dc6b-47eb-a1f5-9c0a360ad922',
      organizationId: '0afc730c-dc6b-47eb-a1f5-9c0a360ad921',
      createdAt: mockedDate
    }
    const mockedUser = {
      id: '0afc730c-dc6b-47eb-a1f5-9c0a360ad920',
      email: 'testEmail@email.com',
      given_name: 'Test',
      family_name: 'Name',
      username: 'testUsername',
      password: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
      inviteCodeUsedId: mockedInviteCodeBase.id,
      organizationId: mockedInviteCodeBase.organizationId,
      isOrganizationManager: false,
      createdAt: mockedDate,
      updatedAt: mockedDate
    }

    const authController = new AuthenticationController({
      given_name: mockedUser.given_name,
      family_name: mockedUser.family_name,
      email: mockedUser.email,
      username: mockedUser.username,
      password: mockedUser.password,
      inviteCode: mockedInviteCodeBase.code
    })

    prismaMock.inviteCode.findUnique.mockResolvedValue({
      ...mockedInviteCodeBase,
      used: false,
      usedById: null
    })
    prismaMock.inviteCode.update.mockResolvedValue({
      ...mockedInviteCodeBase,
      used: false,
      usedById: null
    })
    prismaMock.user.create.mockResolvedValue(mockedUser)

    const user = await authController.register();

    expect(user).toEqual(mockedUser);
  });

  it('should login an existing user and return it', async () => {
    const mockedDate: Date = new Date()
    const mockedUser = {
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

    const mockedInputData = {
      email: 'testEmail@email.com',
      password: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8'
    }

    const authController = new AuthenticationController(mockedInputData)

    prismaMock.user.findUnique.mockResolvedValue(mockedUser)

    const user = await authController.login();
    expect(user).toEqual(mockedUser);
  });
});