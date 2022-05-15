import {
  objectType,
} from 'nexus'
import { Context } from '../context'

import { User } from 'nexus-prisma';

export const UserType = objectType({
  name: User.$name,
  description: User.$description,
  definition(t) {
    // Implement unique identifier
    t.nonNull.field(User.id)
    // email of the user
    t.nonNull.field(User.email)
    // given name of the user
    t.nonNull.field(User.given_name)
    // family name of the user
    t.nonNull.field(User.family_name)
    // username of the user
    t.nonNull.field(User.username)
    // password of the user
    t.nonNull.field(User.password)
    // the invite code used by the user to access the app
    t.field(User.inviteCodeUsed)
    // the invite codes this user has created
    t.list.field('inviteCodesCreated', {
      type: User.inviteCodesCreated.type,
      resolve({ id }, _args, ctx: Context) { 
        return ctx.prisma.inviteCode.findMany({
          where: { createdById: id || undefined },
          orderBy: { createdAt: 'asc' }
        })
      }
    })
    // organization the user is part of
    t.field(User.organization)
    // indicates whether this user has access to the management console
    t.field(User.isOrganizationManager)
    // timestamp when this user object was created
    t.nonNull.field(User.createdAt)
    // timestamp when this user object was last created
    t.nonNull.field(User.updatedAt)
  },
})