import { context } from '../context';
import { ErrorName } from '../ErrorHandling/ErrorType';
import { AuthMode } from '../Enums/AuthMode';
import { DataValidator } from '../Utils/DataValidator';

import { v4 as uuidv4 } from 'uuid';

import { NewUser } from '../Interfaces/newUserInterface';
import { InviteCode, User } from '@prisma/client';
/**
 * Creates a new AuthenticationController which handles everything authentication related
 * @class
 */
export class AuthenticationController {
  private uuid?: string
  private given_name?: string
  private family_name?: string
  private username?: string
  private email: string
  private password: string
  private inviteCode?: string
  private mode?: AuthMode

  constructor(_: { given_name?: string, family_name?: string, email: string, username?: string, password: string, inviteCode?: string }) {
    this.given_name = _.given_name
    this.family_name = _.family_name
    this.email = _.email
    this.username = _.username
    this.password = _.password
    this.inviteCode = _.inviteCode
  }

  /**
  * Starts registration process
  * @public
  * @async
  * @returns {User} Returns newly created User object
  * @throws {ErrorName.INVALID_ARGUMENTS}
  */
  public async register(): Promise<User> {
    this.mode = AuthMode.registration;
    this.uuid = uuidv4();
    if (!this.validateInput()) { throw Error(ErrorName.INVALID_ARGUMENTS) }
    
    const claimedInviteCode = await this.claimInviteCode();
    if (claimedInviteCode === undefined) { throw Error(ErrorName.INCORRECT_DATA) }

    const newUserObj: NewUser = this.getUserObject(claimedInviteCode);
    const user: User = await this.createUser(newUserObj);

    return user;
  }

  /**
  * Starts login process
  * @public
  * @async
  * @returns {User} Returns retrieved User object
  * @throws {ErrorName.INVALID_ARGUMENTS}
  */
    public async login(): Promise<User> {
    this.mode = AuthMode.login;
    if (!this.validateInput()) { throw Error(ErrorName.INVALID_ARGUMENTS) }
    
    const userFound = await this.findUser(this.email)
    if (userFound === null) { throw Error(ErrorName.INCORRECT_DATA) }
    if (!this.checkPassword(userFound.password, this.password)) { throw Error(ErrorName.INCORRECT_DATA) }

    return userFound;
  }

  /**
  * Validates provided values
  * @private
  * @returns {boolean} Indicates whethere provided data is valid
  */
  private validateInput(): boolean {
    if (!DataValidator.validateEmail(this.email)) { return false }
    if (!DataValidator.validatePassword(this.password)) { return false }

    // Check only if new user
    if (this.mode !== AuthMode.registration) { return true }
    if (!DataValidator.validateName(this.given_name || '', this.family_name || '')) { return false }
    if (!DataValidator.validateUsername(this.username || '')) { return false }
    return true
  }

   /**
  * Creates and returns a new user object
  * @private
  * @param {InviteCode} inviteCode object of the inviteCode used to register this new user
  * @returns {string | undefined} id of the claimed invite code or undefined if no invite code was found
  */
  private getUserObject(inviteCode: InviteCode): NewUser {
    return {
      id: this.uuid || '',
      email: this.email || '',
      given_name: this.given_name || '',
      family_name: this.family_name || '',
      username: this.username || '',
      password: this.password || '',
      inviteCodeUsedId: inviteCode.id,
      organizationId: inviteCode.organizationId,
      isOrganizationManager: false
    }
  }

  /**
  * Validates provided inviteCode and claims it when available
  * @private
  * @async
  * @returns {string | undefined} id of the claimed invite code or undefined if no invite code was found
  */
  private async claimInviteCode(): Promise<InviteCode | undefined > {
    const inviteCodeObj = await context.prisma.inviteCode.findUnique({
      where: { code: this.inviteCode }
    })

    if (inviteCodeObj === null) {
      return undefined
    }

    await context.prisma.inviteCode.update({ 
      where: { id: inviteCodeObj.id }, 
      data: { used: true, usedById: this.uuid }
    })
    return inviteCodeObj
  }

  /**
  * Creates new user in database
  * @private
  * @async
  * @param {NewUser} newUser object of the new users data used to create database record
  * @returns {User | undefined} Returns created user object
  */
  private async createUser(newUser: NewUser): Promise<User> {
    return await context.prisma.user.create({
      data: newUser
    })
  }

  /**
  * Retrieve user from database
  * @private
  * @async
  * @param {string} email email of the user
  * @returns {User | undefined} Returns user object or undefined if not user associated with this email was found 
  */
    private async findUser(email: string): Promise<User | null> {
    return await context.prisma.user.findUnique({
      where: { email: email }
    })
  }

  /**
  * Compare two password strings
  * @private
  * @param {string} storedPassword stored password of the user
  * @param {string} enteredPassword password entered by the user
  * @returns {boolean} Returns true if both passwords match, returns false if not
  */
   private checkPassword(storedPassword: string, enteredPassword: string): boolean {
    return (storedPassword === enteredPassword);
  }
}