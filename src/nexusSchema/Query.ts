import {
  objectType, stringArg,
} from 'nexus'
import { Context } from '../context'

import { UserType } from './User'

export const Query = objectType({
  name: 'Query',
  definition(t) {
    t.nonNull.list.nonNull.field('allUsers', {
      type: UserType,
      resolve: (_, __, context: Context) => {
        return context.prisma.user.findMany()
      },
    })

    t.nullable.field('UserById', {
      type: UserType,
      args: {
        id: stringArg(),
      },
      resolve: (_, { id }, context: Context) => {
        return context.prisma.user.findUnique({
          where: { id: id || undefined }
        })
      },
    })
  }
})