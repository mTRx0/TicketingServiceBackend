import { objectType } from 'nexus'
import { InviteCode } from 'nexus-prisma';

export const InviteCodeType = objectType({
  name: InviteCode.$name,
  definition(t) {
    // Implement unique identifier
    t.nonNull.field(InviteCode.id),
    // Actual invite code itself
    t.nonNull.field(InviteCode.code),
    // User who created the invite code
    t.field(InviteCode.createdBy),
    // Boolean whether invite code has been used already
    t.nonNull.boolean('used'),
    // User who used the invite code => optional
    t.field(InviteCode.usedBy)
    t.nonNull.field(InviteCode.createdAt.name, { type: 'DateTime' })
  }
})