import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';

import { organizationCreateDefault, organizationsByUserId } from 'saas-core';
import { accounts, saasdb, sessions, users, verifications } from 'saas-db';

import { AuthRedisStore } from './authRedisStore';

export const auth = betterAuth({
  plugins: [nextCookies()],
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 4,
  },
  database: drizzleAdapter(saasdb, {
    provider: 'pg',
    usePlural: true,
    schema: {
      accounts,
      sessions,
      users,
      verifications,
    },
  }),
  secondaryStorage: AuthRedisStore,

  session: {
    additionalFields: {
      memberOf: {
        type: 'string[]',
        required: true,
        defaultValue: [],
      },
      defaultOrg: {
        type: 'string',
        required: false,
      },
    },
  },

  databaseHooks: {
    user: {
      create: {
        after: async user => {
          await organizationCreateDefault(user.id);
        },
      },
    },
    session: {
      create: {
        before: async session => {
          const userOrgs = await organizationsByUserId(session.userId).unwrapOr(
            { memberOf: [], defaultOrgId: null },
          );

          return {
            data: {
              ...session,
              defaultOrg: userOrgs.defaultOrgId ?? null,
              memberOf: userOrgs.memberOf,
            },
          };
        },
      },
    },
  },

  advanced: {
    database: {
      generateId: false,
    },
  },
});
