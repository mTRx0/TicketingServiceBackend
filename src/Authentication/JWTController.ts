import { User, RefreshToken } from '@prisma/client';
import { ErrorName } from '../ErrorHandling/ErrorType';
import { AuthResponse, IdAuthResponse, AccessTokenPayload, IdTokenPayload, Keys, newRefreshToken } from '../Interfaces';

import { DataValidator } from '../Utils/DataValidator';
import dotenv from 'dotenv';

import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import { DatabaseController } from '../Database/DatabaseController';

dotenv.config();

/**
 * Creates a new AuthenticationController which handles everything authentication related
 * @class
 */
export class JWTController {
   /**
  * Creates and returns a new user object
  * @public
  * @async
  * @param {User} user object of the user data used to create JWT
  * @returns {AuthResponse} object containing access token, id token and refresh token
  */
  public async getIdAuthResponse(user: User): Promise<IdAuthResponse> {
    if (!this.validateInput(user)) { throw Error(ErrorName.INVALID_ARGUMENTS) }

    const accessToken: string = await this.getAccessToken(user.id);
    const idToken: string = await this.getIdToken(user);
    const refreshToken: string = this.getRefreshToken();

    return {
      accessToken: accessToken,
      idToken: idToken,
      refreshToken: refreshToken
    }
  }

  /**
  * Creates and returns a new user object
  * @public
  * @async
  * @param {User} user object of the user data used to create JWT
  * @returns {AuthResponse} object containing access token, id token and refresh token
  */
  public async getAuthResponse(user: User): Promise<AuthResponse> {
    if (!this.validateInput(user)) { throw Error(ErrorName.INVALID_ARGUMENTS) }

    const accessToken: string = await this.getAccessToken(user.id);
    const refreshToken: string = this.getRefreshToken();

    return {
      accessToken: accessToken,
      refreshToken: refreshToken
    }
  }

  /**
  * Takes refresh token as input and returns a new AuthResponse object containing a new valid access token
  * @public
  * @async
  * @param {string} refreshToken refresh token used to refresh the access token
  * @returns {AuthResponse} object containing access token, id token and refresh token
  */
  public async refresh(refreshToken: string): Promise<AuthResponse> {
    const dbController = new DatabaseController();
    await dbController.deleteExpiredRefreshTokens();

    const foundRefreshToken: RefreshToken | null = await dbController.retrieveRefreshTokenData(refreshToken);
    if (foundRefreshToken === null || undefined) { throw Error(ErrorName.INVALID_REFRESH_TOKEN) }

    if (foundRefreshToken.usedInFamily) {
      await dbController.deleteRefreshTokenFamily(foundRefreshToken.tokenFamilyId);
      throw Error(ErrorName.INVALID_REFRESH_TOKEN);
    }

    const newAccessToken: string = await this.getAccessToken(foundRefreshToken.userId);
    const newRefreshToken: string = this.getRefreshToken();

    const refreshTokenDatabaseObject: newRefreshToken = {
      userId: foundRefreshToken.userId,
      tokenFamilyId: foundRefreshToken.tokenFamilyId,
      usedInFamily: false,
      refreshToken: newRefreshToken,
      // Expires after 7 days
      validUntil: new Date(Date.now() + 1000 /*sec*/ * 60 /*min*/ * 60 /*hour*/ * 7 /*day*/)
    }

    await dbController.storeNewRefreshToken(refreshTokenDatabaseObject);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    }
  }

  /**
  * Verifies provided access token and returns userId
  * @public
  * @param {string} accessToken access token provided
  * @returns {string} user id of the user the access token belongs to
  */
  public verifyAccessToken(accessToken: string): string {
    const keys = this.getKeys();
    const payload: AccessTokenPayload = jwt.verify(accessToken, keys.privateKey) as AccessTokenPayload;
    return payload.sub
  }

  /**
  * Generates access token from userId
  * @private
  * @async
  * @returns {string} Returns newly created access token
  */
  private async getAccessToken(userId: string): Promise<string> {
    const accessTokenPayload: AccessTokenPayload = this.getAccessTokenPayload(userId);
    const keys = await this.getKeys();

    return await jwt.sign(accessTokenPayload, keys.privateKey, { expiresIn: '1h' });
  }

  /**
  * Validates provided values
  * @public
  * @static
  * @returns {boolean} Indicates whethere provided data is valid
  */
  private validateInput(user:User): boolean {
    if (!DataValidator.validateEmail(user.email)) { return false }
    if (!DataValidator.validatePassword(user.password)) { return false }

    if (!DataValidator.validateName(user.given_name || '', user.family_name || '')) { return false }
    if (!DataValidator.validateUsername(user.username || '')) { return false }
    return true
  }

  /**
  * Generates access token payload from userId
  * @private
  * @async
  * @returns {AccessTokenPayload} Returns access token payload
  */
  private getAccessTokenPayload(userId: string): AccessTokenPayload {
    return {
      iss: 'TicketingService',
      sub: userId,
      aud: 'TicketingService.WebClient'
    }
  }

  /**
  * Generates id token from user object
  * @private
  * @async
  * @returns {string} Returns newly created id token
  */
  private async getIdToken(user: User): Promise<string> {
    const idTokenPayload: IdTokenPayload = this.getIdTokenPayload(user);
    const keys = await this.getKeys();
    
    return await jwt.sign(idTokenPayload, keys.privateKey, { expiresIn: '10h' });
  }

  /**
  * Generates id token payload from user object
  * @private
  * @async
  * @returns {IdTokenPayload} Returns id token payload
  */
  private getIdTokenPayload(user: User): IdTokenPayload {
    return {
      iss: 'TicketingService',
      sub: user.id,
      aud: 'TicketingService.WebClient',
      userinfo: {
        email: user.email,
        given_name: user.given_name,
        family_name: user.family_name,
        username: user.username,
        organizationId: user.organizationId,
        createdAt: user.createdAt
      }
    }
  }

  /**
  * Retrieves public and private keys used to sign all JWTs
  * @private
  * @async
  * @returns {Keys} Returns object containing private and public key
  */
  private getKeys(): Keys {
    const privateKey = Buffer.from(process.env.JWT_PRIVATE_KEY as string, 'base64')
    const publicKey = Buffer.from(process.env.JWT_PUBLIC_KEY as string, 'base64')
    return {
      privateKey,
      publicKey
    }
  }

  /**
  * Generates refresh token
  * @private
  * @returns {string} Returns refresh token
  */
  private getRefreshToken(): string {
    const refreshCode: string = randomBytes(128).toString('hex');
    return refreshCode;
  }
}