import { TRPCError } from '@trpc/server';
import { cache } from 'react';

import { auth } from 'saas-auth/server';
import { organizationActiveGet, organizationActiveSet } from 'saas-core';

export type TrpcContext = {
  headers: Headers;
  user?: {
    id: string;
    email: string;
    emailVerified: boolean;
    name: string;
    image: string | null;
  };
  userOrgs?: {
    activeOrg: string;
    defaultOrg: string;
    memberOf: string[];
  };
};

export const createTrpcContext = cache(
  async ({ headers }: { headers: Headers }): Promise<TrpcContext> => {
    console.log('CREATING_TRPC_CONTEXT');

    const session = await auth.api.getSession({ headers });

    if (!session?.user) return { headers };

    const { memberOf, defaultOrg } = session.session;

    if (!defaultOrg || !memberOf) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Unexpected empty organizations data',
        cause: { defaultOrg, memberOf },
      });
    }

    const { id, email, emailVerified, name, image = null } = session.user;

    const activeOrg = await organizationActiveGet(id);

    if (activeOrg.isErr()) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Unexpected fail when getting active org',
        cause: activeOrg.error,
      });
    }

    if (!activeOrg.value) await organizationActiveSet(id, defaultOrg);

    return {
      headers,
      user: {
        id,
        name,
        email,
        emailVerified,
        image,
      },
      userOrgs: {
        defaultOrg,
        activeOrg: activeOrg.value || defaultOrg,
        memberOf,
      },
    };
  },
);
