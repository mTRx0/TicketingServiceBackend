import {
  objectType,
} from 'nexus'

import { Context } from '../context'
import { Organization } from 'nexus-prisma';

export const OrganizationType = objectType({
  name: Organization.$name,
  description: Organization.$description,
  definition(t) {
    // unique identifier for the organization
    t.nonNull.field(Organization.id)
    // name of the organization
    t.nonNull.field(Organization.name)
    // all members of this organization
    t.nonNull.field(Organization.member)
    // amount of members in this organization
    t.nonNull.int('memberAmount', {
      resolve: ({ id }, _args, ctx: Context) => {
        return ctx.prisma.user.count({
          where: { organizationId: id }
        })
      }
    })
    // all invite codes created for this organization
    t.nonNull.field(Organization.inviteCodes)
    // timestamp when this user object was created
    t.nonNull.field(Organization.createdAt)
    // timestamp when this user object was last created
    t.nonNull.field(Organization.updatedAt)
  },
})