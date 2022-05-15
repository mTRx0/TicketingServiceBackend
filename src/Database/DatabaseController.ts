import { RefreshToken, User } from "@prisma/client";
import { context } from "../context";
import { ErrorName } from "../ErrorHandling/ErrorType";
import { IdAuthResponse, AuthResponse } from "../Interfaces/AuthResponse";
import { createHash } from "crypto";
import { newRefreshToken } from "../Interfaces";

export class DatabaseController {
  /**
  * Syncs new user registration with database
  * @public
  * @async
  * @param {User} user new user object that has to be created in database
  * @param {AuthResponse} authResponse generated authResponse from JWTAuthenticationController
  */
  public async registerUser(user: User, authResponse: IdAuthResponse) {
    try {
      const hashedRefreshToken: string = this.hashToken(authResponse.refreshToken);

      // Delete all expired refresh tokens
      await this.deleteExpiredRefreshTokens();
      return await context.prisma.$transaction(async (prisma) => {
        await prisma.inviteCode.update({
          where: { id: user.inviteCodeUsedId }, 
          data: { used: true, usedById: user.id }
        })
  
        await prisma.user.create({
          data: user
        })
  
        await prisma.refreshToken.create({
          data: {
            refreshToken: hashedRefreshToken,
            userId: user.id,
            usedInFamily: false,
            // Expires after 7 days
            validUntil: new Date(Date.now() + 1000 * 60 /*sec*/ * 60 /*min*/ * 24 /*hour*/ * 7 /*day*/)
          }
        })

      })
    } catch (e) {
      throw Error(ErrorName.SERVER_ERROR)
    }
  }

  /**
  * Syncs existing user with database
  * @public
  * @async
  * @param {User} userId user id of the user that has to be logged in
  * @param {AuthResponse} authResponse generated authResponse from JWTAuthenticationController
  */
  public async loginUser(userId: string, authResponse: AuthResponse) {
    try {
      const hashedRefreshToken: string = this.hashToken(authResponse.refreshToken);

      // Delete all expired refresh tokens
      await this.deleteExpiredRefreshTokens();
      await context.prisma.$transaction(async (prisma) => {
        await prisma.refreshToken.create({
          data: {
            refreshToken: hashedRefreshToken,
            userId: userId,
            usedInFamily: false,
            // Expires after 7 days
            validUntil: new Date(Date.now() + 1000 /*sec*/ * 60 /*min*/ * 60 /*hour*/ * 7 /*day*/)
          }
        })
      })
    } catch (e) {
      throw Error(ErrorName.SERVER_ERROR)
    }
  }

  /**
  * Syncs existing user logout with database
  * @public
  * @async
  * @param {string} userId user id of the user that has to be logged in
  * @returns {boolean} indicates whether the logout process was successful or not
  */
  public async logoutUser(refreshToken: string) {
    const hashedRefreshToken: string = this.hashToken(refreshToken);
    try {
      // Delete all expired refresh tokens
      await this.deleteExpiredRefreshTokens();
      const refreshTokenObject: RefreshToken | null = await context.prisma.refreshToken.findUnique({ where: { refreshToken: hashedRefreshToken } });
      if (refreshTokenObject === null) { return }

      await this.deleteRefreshTokenFamily(refreshTokenObject.tokenFamilyId);
    } catch (e) {
      throw Error(ErrorName.SERVER_ERROR)
    }
  }

  /** 
  * Deletes all expired tokens in the database
  * @public
  * @async
  */
  public async deleteExpiredRefreshTokens() {
    return await context.prisma.$transaction(async (prisma) => {
      const refreshTokens: RefreshToken[] = await prisma.refreshToken.findMany({ where: { validUntil: { lt: new Date() }, usedInFamily: false } })
      await refreshTokens.forEach(async (refreshToken) => {
        await prisma.refreshToken.deleteMany({ where: { tokenFamilyId: refreshToken.tokenFamilyId } })
      })
    })
  }

  /**
  * Retrieves a RefreshToken object from database
  * @public
  * @async
  * @param {string} refreshToken the refresh token which should be used to retrieve the RefreshToken object
  * @returns {RefreshToken | null} the found RefreshToken object
  */
  public async retrieveRefreshTokenData(refreshToken: string): Promise<RefreshToken | null> {
    const hashedRefreshToken: string = this.hashToken(refreshToken);
    return await context.prisma.refreshToken.findUnique({ where: { refreshToken: hashedRefreshToken } })
  }

  /**
  * Retrieves a refresh token family from database
  * @public
  * @async
  * @param {string} tokenFamilyId the id of the desired token family
  * @returns {RefreshToken[]} the found RefreshToken objects which belong to the provided token family id
  */
  public async retrieveRefreshTokenFamily(tokenFamilyId: string): Promise<RefreshToken[]> {
    return await context.prisma.refreshToken.findMany({ where: { tokenFamilyId: tokenFamilyId } });
  }

  /**
  * Deletes all refresh token with in the provided token family
  * @public
  * @async
  * @param {string} tokenFamilyId the id of the token family which should be deleted
  */
  public async deleteRefreshTokenFamily(tokenFamilyId: string) {
    return await context.prisma.refreshToken.deleteMany({ where: { tokenFamilyId: tokenFamilyId } });
  }

  /**
  * Stores a new RefreshToken object in database
  * @public
  * @async
  * @param {RefreshToken} refreshToken the RefreshToken object which should be created
  * @returns {RefreshToken} the newly created TefreshToken object in database
  */
  public async storeNewRefreshToken(refreshToken: newRefreshToken): Promise<RefreshToken> {
    refreshToken.refreshToken = this.hashToken(refreshToken.refreshToken);
    return await context.prisma.$transaction(async (prisma) => {
      await prisma.refreshToken.updateMany({ where: { tokenFamilyId: refreshToken.tokenFamilyId }, data: { usedInFamily: true } })
      return await prisma.refreshToken.create({ data: refreshToken });
    })
  }

  /**
  * hashes provided token
  * @private
  * @param {string} token token to be hashed
  * @returns {string} hashed token
  */
  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}