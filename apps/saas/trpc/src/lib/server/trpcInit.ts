import 'server-only';

import { TRPCError, initTRPC } from '@trpc/server';
import superjson from 'superjson';

import type { TrpcContext } from './trpcContext';

const t = initTRPC.context<TrpcContext>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
});

export const router = t.router;
export const createCallerFactory = t.createCallerFactory;

export const baseProcedure = t.procedure;

export const authedProcedure = baseProcedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'no user' });
  }
  if (!ctx.userOrgs) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'no orgs' });
  }

  return next({
    ctx: {
      user: ctx.user,
      userOrgs: ctx.userOrgs,
      headers: ctx.headers,
    },
  });
});
