import {
  objectType, stringArg,
} from 'nexus'
import { GraphQLContext } from '../context'

import { UserType } from './User'

export const Query = objectType({
  name: 'Query',
  definition(t) {
    t.nonNull.field('me', {
      type: UserType,
      resolve: (_, __, context: GraphQLContext) => {
        return context.prisma.user.findUnique({
          where: { id: context.userId || undefined }
        })
      },
    })

    t.nonNull.list.nonNull.field('allUsers', {
      type: UserType,
      resolve: (_, __, context: GraphQLContext) => {
        return context.prisma.user.findMany()
      },
    })

    t.nullable.field('UserById', {
      type: UserType,
      args: {
        id: stringArg(),
      },
      resolve: (_, { id }, context: GraphQLContext) => {
        return context.prisma.user.findUnique({
          where: { id: id || undefined }
        })
      },
    })
  }
})