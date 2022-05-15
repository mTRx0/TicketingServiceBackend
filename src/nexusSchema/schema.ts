import {
  makeSchema,
  asNexusMethod,
} from 'nexus'
import { DateTimeResolver } from 'graphql-scalars'

import { UserType } from './User';
import { InviteCodeType } from './InviteCode';
import { OrganizationType } from './Organization';
import { Query } from './Query';

export const DateTime = asNexusMethod(DateTimeResolver, 'date')

export const schema = makeSchema({
  types: [
    Query,
    UserType,
    InviteCodeType,
    OrganizationType,
    DateTime,
  ],
  outputs: {
    typegen: __dirname + '/generated/nexus.ts',
  },
  contextType: {
    module: require.resolve('../context'),
    export: 'Context',
  },
  sourceTypes: {
    modules: [
      {
        module: '@prisma/client',
        alias: 'prisma',
      },
    ],
  },
})