/**
* @interface
*/
export interface NewUser {
  id: string,
  email: string,
  given_name: string,
  family_name: string,
  username: string,
  password: string,
  inviteCodeUsedId: string,
  organizationId: string,
  isOrganizationManager: boolean
}