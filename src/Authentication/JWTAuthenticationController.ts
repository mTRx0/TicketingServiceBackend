import { User } from '@prisma/client';
import { ErrorName } from '../ErrorHandling/ErrorType';
import { AuthResponse } from '../Interfaces/AuthResponse';
import { DataValidator } from '../Utils/DataValidator';

import { promises as fs } from "fs";
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import { context } from '../context';

const privateKeyPath = 'keys/id_rsa';
const publicKeyPath = 'keys/id_rsa.pub';

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
  public async getAuthResponse(user: User): Promise<AuthResponse> {
    if (!this.validateInput(user)) { throw Error(ErrorName.INVALID_ARGUMENTS) }

    const accessToken: string = await this.getAccessToken(user.id)
    const idToken: string = await this.getIdToken(user);
    const refreshToken: string = this.getRefreshToken();

    await this.storeTokens(user.id, { accessToken, refreshToken });
    return {
      accessToken: accessToken,
      idToken: idToken,
      refreshToken: refreshToken
    }
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
  private async getKeys(): Promise<Keys> {
    const privateKey = Buffer.from(await fs.readFile(privateKeyPath))
    const publicKey = Buffer.from(await fs.readFile(publicKeyPath))
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

  /**
  * Store tokens in database
  * @private
  * @async
  * @param {string} userId id of the associated user
  * @param {string} accessToken generated access token
  * @param {string} refreshToken generated refresh token
  */
  private async storeTokens(userId: string, tokens: { accessToken: string, refreshToken: string }) {
    await context.prisma.authToken.create({
      data: {
        userId: userId,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      }
    })
  }
}

interface AccessTokenPayload {
  iss: string,
  sub: string,
  aud: string,
}

interface IdTokenPayload {
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

interface Keys {
  privateKey: Buffer,
  publicKey: Buffer
}